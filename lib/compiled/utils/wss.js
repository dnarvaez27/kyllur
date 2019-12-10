"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : (0, _typeof2["default"])(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = void 0 && (void 0).__metadata || function (k, v) {
  if ((typeof Reflect === "undefined" ? "undefined" : (0, _typeof2["default"])(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var __importStar = void 0 && (void 0).__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ws_1 = __importDefault(require("ws"));

var api_1 = require("./api");

var db_1 = __importStar(require("./db"));

var utils_1 = require("./utils");

var DELTA_INTERVAL = +utils_1.getEnvVar('DELTA_INTERVAL', Infinity);
var PROTOCOL;

(function (PROTOCOL) {
  PROTOCOL["LOCATION"] = "LOCATION";
  PROTOCOL["SUBSCRIBE"] = "SUBSCRIBE";
  PROTOCOL["LIVE"] = "LIVE";
  PROTOCOL["INFO"] = "INFO";
  PROTOCOL["SEPARATOR"] = ";";
  PROTOCOL["CHANNEL_SEPARATOR"] = "@";
})(PROTOCOL || (PROTOCOL = {}));

var Message =
/*#__PURE__*/
function () {
  function Message(msg) {
    (0, _classCallCheck2["default"])(this, Message);
    var data = msg.split(PROTOCOL.SEPARATOR);
    this.type = data[0];
    this.args = data.slice(1);
  }

  (0, _createClass2["default"])(Message, [{
    key: "isLocation",
    value: function isLocation() {
      return this.type === PROTOCOL.LOCATION;
    }
  }, {
    key: "getLocation",
    value: function getLocation() {
      if (this.isLocation()) {
        return {
          latitude: +this.args[0],
          longitude: +this.args[1]
        };
      }

      throw Error("Message is not LOCATION ".concat(this.type, ": ").concat(this.args));
    }
  }, {
    key: "isSubscription",
    value: function isSubscription() {
      return this.type === PROTOCOL.SUBSCRIBE;
    }
  }, {
    key: "getSubscriptionChannel",
    value: function getSubscriptionChannel() {
      return this.args;
    }
  }]);
  return Message;
}();

var ClientManager =
/*#__PURE__*/
function () {
  function ClientManager(ws, id, onClose, onSubscribe, onUnsubscribe, onMessage) {
    var _this = this;

    (0, _classCallCheck2["default"])(this, ClientManager);
    this.clientInterval = undefined;
    this.id = id;
    this.ws = ws;
    this.subscribedChannels = [];

    this.onSubscribe = function (channnel) {
      return onSubscribe(_this, channnel);
    };

    this.onUnsubscribe = function (channnel) {
      return onUnsubscribe(_this, channnel);
    };

    this.onMessage = onMessage;
    ws.on('message', this.onNewMessage.bind(this));
    ws.on('close', this.onClose(onClose).bind(this));
  }

  (0, _createClass2["default"])(ClientManager, [{
    key: "onNewMessage",
    value: function onNewMessage(strmessage) {
      var message = new Message(strmessage);

      if (this.onMessage) {
        this.onMessage(message);
      }

      if (message.isLocation()) {
        this.onLocationReceived(message);
      } else if (message.isSubscription()) {
        this.onSubscriptionReceived(message);
      }
    }
  }, {
    key: "onSubscriptionReceived",
    value: function onSubscriptionReceived(protocol) {
      var channel = protocol.getSubscriptionChannel().join(PROTOCOL.CHANNEL_SEPARATOR);
      var msg = {};
      msg[PROTOCOL.INFO] = {
        msg: "Subscribed to ".concat(channel)
      };
      this.send(msg);
      this.subscribedChannels.push(channel);
      this.onSubscribe(channel);
    }
  }, {
    key: "onLocationReceived",
    value: function onLocationReceived(protocol) {
      var coordinates = protocol.getLocation();
      this.addLocationToDB(coordinates);
      this.initInterval(coordinates);
    }
  }, {
    key: "initInterval",
    value: function initInterval(coordinates) {
      var _this2 = this;

      this.clearClientInterval();
      this.sendResponseLocation(coordinates);
      this.clientInterval = setInterval(function () {
        return _this2.sendResponseLocation(coordinates);
      }, DELTA_INTERVAL);
    }
  }, {
    key: "sendResponseLocation",
    value: function sendResponseLocation(_ref) {
      var _this3 = this;

      var latitude = _ref.latitude,
          longitude = _ref.longitude;

      (function _callee() {
        var satellites, stars, msg;
        return _regenerator["default"].async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _regenerator["default"].awrap(api_1.getSatellites(latitude, longitude));

              case 2:
                satellites = _context.sent;
                _context.next = 5;
                return _regenerator["default"].awrap(api_1.getStars(latitude, longitude));

              case 5:
                stars = _context.sent;
                msg = {};
                msg[PROTOCOL.LIVE] = {
                  satellites: satellites,
                  stars: stars
                };

                _this3.send(msg);

              case 9:
              case "end":
                return _context.stop();
            }
          }
        });
      })();
    } // NOTE: Check if reallocate into another component

  }, {
    key: "addLocationToDB",
    value: function addLocationToDB(_ref2) {
      var latitude = _ref2.latitude,
          longitude = _ref2.longitude;

      (function _callee2() {
        return _regenerator["default"].async(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _regenerator["default"].awrap(db_1["default"].execQuery(db_1.Functions.createOne, 'locations', {}, {
                  data: {
                    latitude: latitude,
                    longitude: longitude
                  }
                }));

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        });
      })();
    }
  }, {
    key: "send",
    value: function send(data) {
      if ((0, _typeof2["default"])(data) === 'object') {
        this.ws.send(JSON.stringify(data));
      } else {
        this.ws.send("".concat(data));
      }
    }
  }, {
    key: "clearClientInterval",
    value: function clearClientInterval() {
      if (this.clientInterval) {
        clearInterval(this.clientInterval);
      }
    }
  }, {
    key: "onClose",
    value: function onClose(close) {
      var _this4 = this;

      return function () {
        if (_this4.clientInterval) {
          clearInterval(_this4.clientInterval);
        }

        close(_this4);
      };
    }
  }]);
  return ClientManager;
}();

__decorate([utils_1.decorators.log('WS'), __metadata("design:type", Function), __metadata("design:paramtypes", [String]), __metadata("design:returntype", void 0)], ClientManager.prototype, "onNewMessage", null);

__decorate([utils_1.decorators.log('WS'), __metadata("design:type", Function), __metadata("design:paramtypes", [Message]), __metadata("design:returntype", void 0)], ClientManager.prototype, "onSubscriptionReceived", null);

__decorate([utils_1.decorators.log('WS'), __metadata("design:type", Function), __metadata("design:paramtypes", [Message]), __metadata("design:returntype", void 0)], ClientManager.prototype, "onLocationReceived", null);

__decorate([utils_1.decorators.log('WS'), __metadata("design:type", Function), __metadata("design:paramtypes", [Object]), __metadata("design:returntype", void 0)], ClientManager.prototype, "sendResponseLocation", null);

__decorate([utils_1.decorators.log('WS'), __metadata("design:type", Function), __metadata("design:paramtypes", [Object]), __metadata("design:returntype", void 0)], ClientManager.prototype, "addLocationToDB", null);

__decorate([utils_1.decorators.log('WS', {
  logArguments: false
}), __metadata("design:type", Function), __metadata("design:paramtypes", [Object]), __metadata("design:returntype", void 0)], ClientManager.prototype, "send", null);

var Channel =
/*#__PURE__*/
function () {
  function Channel(name) {
    (0, _classCallCheck2["default"])(this, Channel);
    this.name = name;
    this.clients = {};
  }

  (0, _createClass2["default"])(Channel, [{
    key: "addClient",
    value: function addClient(client) {
      this.clients[client.id] = client;
    }
  }, {
    key: "removeClient",
    value: function removeClient(client) {
      delete this.clients[client.id];
    }
  }, {
    key: "notify",
    value: function notify(data) {
      Object.values(this.clients).forEach(function (c) {
        return c.send(data);
      });
    }
  }, {
    key: "isEmpty",
    get: function get() {
      return Object.values(this.clients).length === 0;
    }
  }]);
  return Channel;
}();

__decorate([utils_1.decorators.intercept({
  before: function before(obj) {
    return console.log("Channel: Notifying ".concat(obj.name));
  }
}), __metadata("design:type", Function), __metadata("design:paramtypes", [Object]), __metadata("design:returntype", void 0)], Channel.prototype, "notify", null);

var WSS =
/*#__PURE__*/
function () {
  function WSS() {
    (0, _classCallCheck2["default"])(this, WSS);
    this.wss = undefined;
    this.clients = {};
    this.channels = {};
    this.clientsCount = 0;
    this.newChannelListener = undefined;
    this.emptyChannelListener = undefined;
    this.onClientClose = this.onClientClose.bind(this);
    this.onClientSubscribe = this.onClientSubscribe.bind(this);
    this.onClientUnsubscribe = this.onClientUnsubscribe.bind(this);
    this.notifyAll = this.notifyAll.bind(this);
    this.notify = this.notify.bind(this);
    this.setup = this.setup.bind(this);
    this.onNewConnection = this.onNewConnection.bind(this);
  }

  (0, _createClass2["default"])(WSS, [{
    key: "setup",
    value: function setup(server) {
      this.wss = new ws_1["default"].Server(server);
      this.wss.on('connection', this.onNewConnection);
    }
  }, {
    key: "onNewConnection",
    value: function onNewConnection(ws) {
      var client = new ClientManager(ws, this.clientsCount++, this.onClientClose, this.onClientSubscribe, this.onClientUnsubscribe, this.messageListener && this.messageListener.bind(this));
      this.clients[client.id] = client;
    }
  }, {
    key: "setOnNewChannelListener",
    value: function setOnNewChannelListener(newChannelListener) {
      this.newChannelListener = newChannelListener;
    }
  }, {
    key: "setOnEmptyChannelListener",
    value: function setOnEmptyChannelListener(emptyChannelListener) {
      this.emptyChannelListener = emptyChannelListener;
    }
  }, {
    key: "setOnNewMessageListener",
    value: function setOnNewMessageListener(messageListener) {
      this.messageListener = messageListener;
    }
  }, {
    key: "onClientClose",
    value: function onClientClose(client) {
      var _this5 = this;

      client.subscribedChannels.forEach(function (ch) {
        _this5.onClientUnsubscribe(client, ch);
      });
      delete this.clients[client.id];
    }
  }, {
    key: "onClientSubscribe",
    value: function onClientSubscribe(client, channel) {
      var newChannel = false;

      if (!(channel in this.channels)) {
        this.channels[channel] = new Channel(channel);
        newChannel = true;
      }

      this.channels[channel].addClient(client);

      if (newChannel && this.newChannelListener) {
        this.newChannelListener(channel);
      }
    }
  }, {
    key: "onClientUnsubscribe",
    value: function onClientUnsubscribe(client, channel) {
      if (channel in this.channels) {
        this.channels[channel].removeClient(client);

        if (this.channels[channel].isEmpty) {
          delete this.channels[channel]; // If channel is empty, notifies the listener

          if (this.emptyChannelListener) {
            this.emptyChannelListener(channel);
          }
        }
      }
    }
  }, {
    key: "notifyAll",
    value: function notifyAll(data) {
      Object.values(this.clients).forEach(function (cli) {
        return cli.send(data);
      });
    }
  }, {
    key: "notify",
    value: function notify(channel) {
      var _this6 = this;

      return function (data) {
        if (_this6.channels[channel]) {
          _this6.channels[channel].notify(data);
        }
      };
    }
  }]);
  return WSS;
}();

__decorate([utils_1.decorators.log('WSS', {
  logArguments: false
}), __metadata("design:type", Function), __metadata("design:paramtypes", [ws_1["default"]]), __metadata("design:returntype", void 0)], WSS.prototype, "onNewConnection", null);

__decorate([utils_1.decorators.log('WSS', {
  logArguments: false
}), utils_1.decorators.intercept({
  before: function before(obj, args) {
    return console.log("WSS: Closing client ".concat(args[0].id));
  },
  after: function after(obj) {
    return console.log("WSS: ".concat(Object.keys(obj.clients).length, " clients left"));
  }
}), __metadata("design:type", Function), __metadata("design:paramtypes", [ClientManager]), __metadata("design:returntype", void 0)], WSS.prototype, "onClientClose", null);

__decorate([utils_1.decorators.intercept({
  before: function before(obj, args) {
    return console.log("WSS: Client ".concat(args[0].id, " subscription ").concat(args[1]));
  }
}), __metadata("design:type", Function), __metadata("design:paramtypes", [ClientManager, String]), __metadata("design:returntype", void 0)], WSS.prototype, "onClientSubscribe", null);

__decorate([utils_1.decorators.intercept({
  before: function before(obj, args) {
    return console.log("WSS: Client ".concat(args[0].id, " unsubscription ").concat(args[1]));
  },
  after: function after(obj) {
    return console.log("WSS: ".concat(Object.keys(obj.channels).length, " alive"));
  }
}), __metadata("design:type", Function), __metadata("design:paramtypes", [ClientManager, String]), __metadata("design:returntype", void 0)], WSS.prototype, "onClientUnsubscribe", null);

__decorate([utils_1.decorators.intercept({
  before: function before() {
    return console.log("WSS: Notifying all");
  }
}), __metadata("design:type", Function), __metadata("design:paramtypes", [Object]), __metadata("design:returntype", void 0)], WSS.prototype, "notifyAll", null);

exports["default"] = WSS;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3RzL3V0aWxzL3dzcy5qcyJdLCJuYW1lcyI6WyJfX2RlY29yYXRlIiwiZGVjb3JhdG9ycyIsInRhcmdldCIsImtleSIsImRlc2MiLCJjIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiciIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImQiLCJSZWZsZWN0IiwiZGVjb3JhdGUiLCJpIiwiZGVmaW5lUHJvcGVydHkiLCJfX21ldGFkYXRhIiwiayIsInYiLCJtZXRhZGF0YSIsIl9faW1wb3J0RGVmYXVsdCIsIm1vZCIsIl9fZXNNb2R1bGUiLCJfX2ltcG9ydFN0YXIiLCJyZXN1bHQiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJleHBvcnRzIiwidmFsdWUiLCJ3c18xIiwicmVxdWlyZSIsImFwaV8xIiwiZGJfMSIsInV0aWxzXzEiLCJERUxUQV9JTlRFUlZBTCIsImdldEVudlZhciIsIkluZmluaXR5IiwiUFJPVE9DT0wiLCJNZXNzYWdlIiwibXNnIiwiZGF0YSIsInNwbGl0IiwiU0VQQVJBVE9SIiwidHlwZSIsImFyZ3MiLCJzbGljZSIsIkxPQ0FUSU9OIiwiaXNMb2NhdGlvbiIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwiRXJyb3IiLCJTVUJTQ1JJQkUiLCJDbGllbnRNYW5hZ2VyIiwid3MiLCJpZCIsIm9uQ2xvc2UiLCJvblN1YnNjcmliZSIsIm9uVW5zdWJzY3JpYmUiLCJvbk1lc3NhZ2UiLCJjbGllbnRJbnRlcnZhbCIsInVuZGVmaW5lZCIsInN1YnNjcmliZWRDaGFubmVscyIsImNoYW5ubmVsIiwib24iLCJvbk5ld01lc3NhZ2UiLCJiaW5kIiwic3RybWVzc2FnZSIsIm1lc3NhZ2UiLCJvbkxvY2F0aW9uUmVjZWl2ZWQiLCJpc1N1YnNjcmlwdGlvbiIsIm9uU3Vic2NyaXB0aW9uUmVjZWl2ZWQiLCJwcm90b2NvbCIsImNoYW5uZWwiLCJnZXRTdWJzY3JpcHRpb25DaGFubmVsIiwiam9pbiIsIkNIQU5ORUxfU0VQQVJBVE9SIiwiSU5GTyIsInNlbmQiLCJwdXNoIiwiY29vcmRpbmF0ZXMiLCJnZXRMb2NhdGlvbiIsImFkZExvY2F0aW9uVG9EQiIsImluaXRJbnRlcnZhbCIsImNsZWFyQ2xpZW50SW50ZXJ2YWwiLCJzZW5kUmVzcG9uc2VMb2NhdGlvbiIsInNldEludGVydmFsIiwiZ2V0U2F0ZWxsaXRlcyIsInNhdGVsbGl0ZXMiLCJnZXRTdGFycyIsInN0YXJzIiwiTElWRSIsImV4ZWNRdWVyeSIsIkZ1bmN0aW9ucyIsImNyZWF0ZU9uZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJjbGVhckludGVydmFsIiwiY2xvc2UiLCJsb2ciLCJGdW5jdGlvbiIsIlN0cmluZyIsInByb3RvdHlwZSIsImxvZ0FyZ3VtZW50cyIsIkNoYW5uZWwiLCJuYW1lIiwiY2xpZW50cyIsImNsaWVudCIsInZhbHVlcyIsImZvckVhY2giLCJpbnRlcmNlcHQiLCJiZWZvcmUiLCJvYmoiLCJjb25zb2xlIiwiV1NTIiwid3NzIiwiY2hhbm5lbHMiLCJjbGllbnRzQ291bnQiLCJuZXdDaGFubmVsTGlzdGVuZXIiLCJlbXB0eUNoYW5uZWxMaXN0ZW5lciIsIm9uQ2xpZW50Q2xvc2UiLCJvbkNsaWVudFN1YnNjcmliZSIsIm9uQ2xpZW50VW5zdWJzY3JpYmUiLCJub3RpZnlBbGwiLCJub3RpZnkiLCJzZXR1cCIsIm9uTmV3Q29ubmVjdGlvbiIsInNlcnZlciIsIlNlcnZlciIsIm1lc3NhZ2VMaXN0ZW5lciIsImNoIiwibmV3Q2hhbm5lbCIsImFkZENsaWVudCIsInJlbW92ZUNsaWVudCIsImlzRW1wdHkiLCJjbGkiLCJhZnRlciIsImtleXMiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7QUFDQSxJQUFJQSxVQUFVLEdBQUksVUFBUSxTQUFLQSxVQUFkLElBQTZCLFVBQVVDLFVBQVYsRUFBc0JDLE1BQXRCLEVBQThCQyxHQUE5QixFQUFtQ0MsSUFBbkMsRUFBeUM7QUFDbkYsTUFBSUMsQ0FBQyxHQUFHQyxTQUFTLENBQUNDLE1BQWxCO0FBQUEsTUFBMEJD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QkFBRCxFQUFzQixDQUFDb0MsYUFBRCxFQUFnQmdELE1BQWhCLENBQXRCLENBTkgsRUFPUHBGLFVBQVUsQ0FBQyxtQkFBRCxFQUFzQixLQUFLLENBQTNCLENBUEgsQ0FBRCxFQVFQaUcsR0FBRyxDQUFDWixTQVJHLEVBUVEscUJBUlIsRUFRK0IsSUFSL0IsQ0FBVjs7QUFTQXJHLFVBQVUsQ0FBQyxDQUNQaUMsT0FBTyxDQUFDaEMsVUFBUixDQUFtQjRHLFNBQW5CLENBQTZCO0FBQUVDLEVBQUFBLE1BQU0sRUFBRTtBQUFBLFdBQU1FLE9BQU8sQ0FBQ2QsR0FBUixzQkFBTjtBQUFBO0FBQVYsQ0FBN0IsQ0FETyxFQUVQbEYsVUFBVSxDQUFDLGFBQUQsRUFBZ0JtRixRQUFoQixDQUZILEVBR1BuRixVQUFVLENBQUMsbUJBQUQsRUFBc0IsQ0FBQ1AsTUFBRCxDQUF0QixDQUhILEVBSVBPLFVBQVUsQ0FBQyxtQkFBRCxFQUFzQixLQUFLLENBQTNCLENBSkgsQ0FBRCxFQUtQaUcsR0FBRyxDQUFDWixTQUxHLEVBS1EsV0FMUixFQUtxQixJQUxyQixDQUFWOztBQU1BMUUsT0FBTyxXQUFQLEdBQWtCc0YsR0FBbEIiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufTtcclxudmFyIF9fbWV0YWRhdGEgPSAodGhpcyAmJiB0aGlzLl9fbWV0YWRhdGEpIHx8IGZ1bmN0aW9uIChrLCB2KSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEoaywgdik7XHJcbn07XHJcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XHJcbn07XHJcbnZhciBfX2ltcG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0U3RhcikgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSByZXN1bHRba10gPSBtb2Rba107XHJcbiAgICByZXN1bHRbXCJkZWZhdWx0XCJdID0gbW9kO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCB3c18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJ3c1wiKSk7XHJcbmNvbnN0IGFwaV8xID0gcmVxdWlyZShcIi4vYXBpXCIpO1xyXG5jb25zdCBkYl8xID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCIuL2RiXCIpKTtcclxuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xyXG5jb25zdCBERUxUQV9JTlRFUlZBTCA9ICsodXRpbHNfMS5nZXRFbnZWYXIoJ0RFTFRBX0lOVEVSVkFMJywgSW5maW5pdHkpKTtcclxudmFyIFBST1RPQ09MO1xyXG4oZnVuY3Rpb24gKFBST1RPQ09MKSB7XHJcbiAgICBQUk9UT0NPTFtcIkxPQ0FUSU9OXCJdID0gXCJMT0NBVElPTlwiO1xyXG4gICAgUFJPVE9DT0xbXCJTVUJTQ1JJQkVcIl0gPSBcIlNVQlNDUklCRVwiO1xyXG4gICAgUFJPVE9DT0xbXCJMSVZFXCJdID0gXCJMSVZFXCI7XHJcbiAgICBQUk9UT0NPTFtcIklORk9cIl0gPSBcIklORk9cIjtcclxuICAgIFBST1RPQ09MW1wiU0VQQVJBVE9SXCJdID0gXCI7XCI7XHJcbiAgICBQUk9UT0NPTFtcIkNIQU5ORUxfU0VQQVJBVE9SXCJdID0gXCJAXCI7XHJcbn0pKFBST1RPQ09MIHx8IChQUk9UT0NPTCA9IHt9KSk7XHJcbmNsYXNzIE1lc3NhZ2Uge1xyXG4gICAgY29uc3RydWN0b3IobXNnKSB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IG1zZy5zcGxpdChQUk9UT0NPTC5TRVBBUkFUT1IpO1xyXG4gICAgICAgIHRoaXMudHlwZSA9IGRhdGFbMF07XHJcbiAgICAgICAgdGhpcy5hcmdzID0gZGF0YS5zbGljZSgxKTtcclxuICAgIH1cclxuICAgIGlzTG9jYXRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gUFJPVE9DT0wuTE9DQVRJT047XHJcbiAgICB9XHJcbiAgICBnZXRMb2NhdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0xvY2F0aW9uKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgbGF0aXR1ZGU6ICt0aGlzLmFyZ3NbMF0sIGxvbmdpdHVkZTogK3RoaXMuYXJnc1sxXSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aHJvdyBFcnJvcihgTWVzc2FnZSBpcyBub3QgTE9DQVRJT04gJHt0aGlzLnR5cGV9OiAke3RoaXMuYXJnc31gKTtcclxuICAgIH1cclxuICAgIGlzU3Vic2NyaXB0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnR5cGUgPT09IFBST1RPQ09MLlNVQlNDUklCRTtcclxuICAgIH1cclxuICAgIGdldFN1YnNjcmlwdGlvbkNoYW5uZWwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJncztcclxuICAgIH1cclxufVxyXG5jbGFzcyBDbGllbnRNYW5hZ2VyIHtcclxuICAgIGNvbnN0cnVjdG9yKHdzLCBpZCwgb25DbG9zZSwgb25TdWJzY3JpYmUsIG9uVW5zdWJzY3JpYmUsIG9uTWVzc2FnZSkge1xyXG4gICAgICAgIHRoaXMuY2xpZW50SW50ZXJ2YWwgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMud3MgPSB3cztcclxuICAgICAgICB0aGlzLnN1YnNjcmliZWRDaGFubmVscyA9IFtdO1xyXG4gICAgICAgIHRoaXMub25TdWJzY3JpYmUgPSAoY2hhbm5uZWwpID0+IG9uU3Vic2NyaWJlKHRoaXMsIGNoYW5ubmVsKTtcclxuICAgICAgICB0aGlzLm9uVW5zdWJzY3JpYmUgPSAoY2hhbm5uZWwpID0+IG9uVW5zdWJzY3JpYmUodGhpcywgY2hhbm5uZWwpO1xyXG4gICAgICAgIHRoaXMub25NZXNzYWdlID0gb25NZXNzYWdlO1xyXG4gICAgICAgIHdzLm9uKCdtZXNzYWdlJywgdGhpcy5vbk5ld01lc3NhZ2UuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgd3Mub24oJ2Nsb3NlJywgdGhpcy5vbkNsb3NlKG9uQ2xvc2UpLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG4gICAgb25OZXdNZXNzYWdlKHN0cm1lc3NhZ2UpIHtcclxuICAgICAgICBjb25zdCBtZXNzYWdlID0gbmV3IE1lc3NhZ2Uoc3RybWVzc2FnZSk7XHJcbiAgICAgICAgaWYgKHRoaXMub25NZXNzYWdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25NZXNzYWdlKG1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobWVzc2FnZS5pc0xvY2F0aW9uKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkxvY2F0aW9uUmVjZWl2ZWQobWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG1lc3NhZ2UuaXNTdWJzY3JpcHRpb24oKSkge1xyXG4gICAgICAgICAgICB0aGlzLm9uU3Vic2NyaXB0aW9uUmVjZWl2ZWQobWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgb25TdWJzY3JpcHRpb25SZWNlaXZlZChwcm90b2NvbCkge1xyXG4gICAgICAgIGNvbnN0IGNoYW5uZWwgPSBwcm90b2NvbC5nZXRTdWJzY3JpcHRpb25DaGFubmVsKCkuam9pbihQUk9UT0NPTC5DSEFOTkVMX1NFUEFSQVRPUik7XHJcbiAgICAgICAgY29uc3QgbXNnID0ge307XHJcbiAgICAgICAgbXNnW1BST1RPQ09MLklORk9dID0geyBtc2c6IGBTdWJzY3JpYmVkIHRvICR7Y2hhbm5lbH1gIH07XHJcbiAgICAgICAgdGhpcy5zZW5kKG1zZyk7XHJcbiAgICAgICAgdGhpcy5zdWJzY3JpYmVkQ2hhbm5lbHMucHVzaChjaGFubmVsKTtcclxuICAgICAgICB0aGlzLm9uU3Vic2NyaWJlKGNoYW5uZWwpO1xyXG4gICAgfVxyXG4gICAgb25Mb2NhdGlvblJlY2VpdmVkKHByb3RvY29sKSB7XHJcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZXMgPSBwcm90b2NvbC5nZXRMb2NhdGlvbigpO1xyXG4gICAgICAgIHRoaXMuYWRkTG9jYXRpb25Ub0RCKGNvb3JkaW5hdGVzKTtcclxuICAgICAgICB0aGlzLmluaXRJbnRlcnZhbChjb29yZGluYXRlcyk7XHJcbiAgICB9XHJcbiAgICBpbml0SW50ZXJ2YWwoY29vcmRpbmF0ZXMpIHtcclxuICAgICAgICB0aGlzLmNsZWFyQ2xpZW50SW50ZXJ2YWwoKTtcclxuICAgICAgICB0aGlzLnNlbmRSZXNwb25zZUxvY2F0aW9uKGNvb3JkaW5hdGVzKTtcclxuICAgICAgICB0aGlzLmNsaWVudEludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4gdGhpcy5zZW5kUmVzcG9uc2VMb2NhdGlvbihjb29yZGluYXRlcyksIERFTFRBX0lOVEVSVkFMKTtcclxuICAgIH1cclxuICAgIHNlbmRSZXNwb25zZUxvY2F0aW9uKHsgbGF0aXR1ZGUsIGxvbmdpdHVkZSB9KSB7XHJcbiAgICAgICAgKGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgc2F0ZWxsaXRlcyA9IGF3YWl0IGFwaV8xLmdldFNhdGVsbGl0ZXMobGF0aXR1ZGUsIGxvbmdpdHVkZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXJzID0gYXdhaXQgYXBpXzEuZ2V0U3RhcnMobGF0aXR1ZGUsIGxvbmdpdHVkZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1zZyA9IHt9O1xyXG4gICAgICAgICAgICBtc2dbUFJPVE9DT0wuTElWRV0gPSB7IHNhdGVsbGl0ZXMsIHN0YXJzIH07XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZChtc2cpO1xyXG4gICAgICAgIH0pKCk7XHJcbiAgICB9XHJcbiAgICAvLyBOT1RFOiBDaGVjayBpZiByZWFsbG9jYXRlIGludG8gYW5vdGhlciBjb21wb25lbnRcclxuICAgIGFkZExvY2F0aW9uVG9EQih7IGxhdGl0dWRlLCBsb25naXR1ZGUgfSkge1xyXG4gICAgICAgIChhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IGRiXzEuZGVmYXVsdC5leGVjUXVlcnkoZGJfMS5GdW5jdGlvbnMuY3JlYXRlT25lLCAnbG9jYXRpb25zJywge30sIHsgZGF0YTogeyBsYXRpdHVkZSwgbG9uZ2l0dWRlIH0gfSk7XHJcbiAgICAgICAgfSkoKTtcclxuICAgIH1cclxuICAgIHNlbmQoZGF0YSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgdGhpcy53cy5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMud3Muc2VuZChgJHtkYXRhfWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNsZWFyQ2xpZW50SW50ZXJ2YWwoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2xpZW50SW50ZXJ2YWwpIHtcclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmNsaWVudEludGVydmFsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBvbkNsb3NlKGNsb3NlKSB7XHJcbiAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2xpZW50SW50ZXJ2YWwpIHtcclxuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5jbGllbnRJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2xvc2UodGhpcyk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5fX2RlY29yYXRlKFtcclxuICAgIHV0aWxzXzEuZGVjb3JhdG9ycy5sb2coJ1dTJyksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtTdHJpbmddKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCB2b2lkIDApXHJcbl0sIENsaWVudE1hbmFnZXIucHJvdG90eXBlLCBcIm9uTmV3TWVzc2FnZVwiLCBudWxsKTtcclxuX19kZWNvcmF0ZShbXHJcbiAgICB1dGlsc18xLmRlY29yYXRvcnMubG9nKCdXUycpLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbTWVzc2FnZV0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIHZvaWQgMClcclxuXSwgQ2xpZW50TWFuYWdlci5wcm90b3R5cGUsIFwib25TdWJzY3JpcHRpb25SZWNlaXZlZFwiLCBudWxsKTtcclxuX19kZWNvcmF0ZShbXHJcbiAgICB1dGlsc18xLmRlY29yYXRvcnMubG9nKCdXUycpLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbTWVzc2FnZV0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIHZvaWQgMClcclxuXSwgQ2xpZW50TWFuYWdlci5wcm90b3R5cGUsIFwib25Mb2NhdGlvblJlY2VpdmVkXCIsIG51bGwpO1xyXG5fX2RlY29yYXRlKFtcclxuICAgIHV0aWxzXzEuZGVjb3JhdG9ycy5sb2coJ1dTJyksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtPYmplY3RdKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCB2b2lkIDApXHJcbl0sIENsaWVudE1hbmFnZXIucHJvdG90eXBlLCBcInNlbmRSZXNwb25zZUxvY2F0aW9uXCIsIG51bGwpO1xyXG5fX2RlY29yYXRlKFtcclxuICAgIHV0aWxzXzEuZGVjb3JhdG9ycy5sb2coJ1dTJyksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtPYmplY3RdKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCB2b2lkIDApXHJcbl0sIENsaWVudE1hbmFnZXIucHJvdG90eXBlLCBcImFkZExvY2F0aW9uVG9EQlwiLCBudWxsKTtcclxuX19kZWNvcmF0ZShbXHJcbiAgICB1dGlsc18xLmRlY29yYXRvcnMubG9nKCdXUycsIHsgbG9nQXJndW1lbnRzOiBmYWxzZSB9KSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW09iamVjdF0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIHZvaWQgMClcclxuXSwgQ2xpZW50TWFuYWdlci5wcm90b3R5cGUsIFwic2VuZFwiLCBudWxsKTtcclxuY2xhc3MgQ2hhbm5lbCB7XHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLmNsaWVudHMgPSB7fTtcclxuICAgIH1cclxuICAgIGFkZENsaWVudChjbGllbnQpIHtcclxuICAgICAgICB0aGlzLmNsaWVudHNbY2xpZW50LmlkXSA9IGNsaWVudDtcclxuICAgIH1cclxuICAgIHJlbW92ZUNsaWVudChjbGllbnQpIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5jbGllbnRzW2NsaWVudC5pZF07XHJcbiAgICB9XHJcbiAgICBub3RpZnkoZGF0YSkge1xyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5jbGllbnRzKS5mb3JFYWNoKGMgPT4gYy5zZW5kKGRhdGEpKTtcclxuICAgIH1cclxuICAgIGdldCBpc0VtcHR5KCkge1xyXG4gICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKHRoaXMuY2xpZW50cykubGVuZ3RoID09PSAwO1xyXG4gICAgfVxyXG59XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgdXRpbHNfMS5kZWNvcmF0b3JzLmludGVyY2VwdCh7IGJlZm9yZTogKG9iaikgPT4gY29uc29sZS5sb2coYENoYW5uZWw6IE5vdGlmeWluZyAke29iai5uYW1lfWApIH0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbT2JqZWN0XSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgdm9pZCAwKVxyXG5dLCBDaGFubmVsLnByb3RvdHlwZSwgXCJub3RpZnlcIiwgbnVsbCk7XHJcbmNsYXNzIFdTUyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLndzcyA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmNsaWVudHMgPSB7fTtcclxuICAgICAgICB0aGlzLmNoYW5uZWxzID0ge307XHJcbiAgICAgICAgdGhpcy5jbGllbnRzQ291bnQgPSAwO1xyXG4gICAgICAgIHRoaXMubmV3Q2hhbm5lbExpc3RlbmVyID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuZW1wdHlDaGFubmVsTGlzdGVuZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5vbkNsaWVudENsb3NlID0gdGhpcy5vbkNsaWVudENsb3NlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5vbkNsaWVudFN1YnNjcmliZSA9IHRoaXMub25DbGllbnRTdWJzY3JpYmUuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLm9uQ2xpZW50VW5zdWJzY3JpYmUgPSB0aGlzLm9uQ2xpZW50VW5zdWJzY3JpYmUuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLm5vdGlmeUFsbCA9IHRoaXMubm90aWZ5QWxsLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5ub3RpZnkgPSB0aGlzLm5vdGlmeS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuc2V0dXAgPSB0aGlzLnNldHVwLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5vbk5ld0Nvbm5lY3Rpb24gPSB0aGlzLm9uTmV3Q29ubmVjdGlvbi5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgc2V0dXAoc2VydmVyKSB7XHJcbiAgICAgICAgdGhpcy53c3MgPSBuZXcgd3NfMS5kZWZhdWx0LlNlcnZlcihzZXJ2ZXIpO1xyXG4gICAgICAgIHRoaXMud3NzLm9uKCdjb25uZWN0aW9uJywgdGhpcy5vbk5ld0Nvbm5lY3Rpb24pO1xyXG4gICAgfVxyXG4gICAgb25OZXdDb25uZWN0aW9uKHdzKSB7XHJcbiAgICAgICAgY29uc3QgY2xpZW50ID0gbmV3IENsaWVudE1hbmFnZXIod3MsIHRoaXMuY2xpZW50c0NvdW50KyssIHRoaXMub25DbGllbnRDbG9zZSwgdGhpcy5vbkNsaWVudFN1YnNjcmliZSwgdGhpcy5vbkNsaWVudFVuc3Vic2NyaWJlLCB0aGlzLm1lc3NhZ2VMaXN0ZW5lciAmJiB0aGlzLm1lc3NhZ2VMaXN0ZW5lci5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLmNsaWVudHNbY2xpZW50LmlkXSA9IGNsaWVudDtcclxuICAgIH1cclxuICAgIHNldE9uTmV3Q2hhbm5lbExpc3RlbmVyKG5ld0NoYW5uZWxMaXN0ZW5lcikge1xyXG4gICAgICAgIHRoaXMubmV3Q2hhbm5lbExpc3RlbmVyID0gbmV3Q2hhbm5lbExpc3RlbmVyO1xyXG4gICAgfVxyXG4gICAgc2V0T25FbXB0eUNoYW5uZWxMaXN0ZW5lcihlbXB0eUNoYW5uZWxMaXN0ZW5lcikge1xyXG4gICAgICAgIHRoaXMuZW1wdHlDaGFubmVsTGlzdGVuZXIgPSBlbXB0eUNoYW5uZWxMaXN0ZW5lcjtcclxuICAgIH1cclxuICAgIHNldE9uTmV3TWVzc2FnZUxpc3RlbmVyKG1lc3NhZ2VMaXN0ZW5lcikge1xyXG4gICAgICAgIHRoaXMubWVzc2FnZUxpc3RlbmVyID0gbWVzc2FnZUxpc3RlbmVyO1xyXG4gICAgfVxyXG4gICAgb25DbGllbnRDbG9zZShjbGllbnQpIHtcclxuICAgICAgICBjbGllbnQuc3Vic2NyaWJlZENoYW5uZWxzLmZvckVhY2goY2ggPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2xpZW50VW5zdWJzY3JpYmUoY2xpZW50LCBjaCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuY2xpZW50c1tjbGllbnQuaWRdO1xyXG4gICAgfVxyXG4gICAgb25DbGllbnRTdWJzY3JpYmUoY2xpZW50LCBjaGFubmVsKSB7XHJcbiAgICAgICAgbGV0IG5ld0NoYW5uZWwgPSBmYWxzZTtcclxuICAgICAgICBpZiAoIShjaGFubmVsIGluIHRoaXMuY2hhbm5lbHMpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbHNbY2hhbm5lbF0gPSBuZXcgQ2hhbm5lbChjaGFubmVsKTtcclxuICAgICAgICAgICAgbmV3Q2hhbm5lbCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2hhbm5lbHNbY2hhbm5lbF0uYWRkQ2xpZW50KGNsaWVudCk7XHJcbiAgICAgICAgaWYgKG5ld0NoYW5uZWwgJiYgdGhpcy5uZXdDaGFubmVsTGlzdGVuZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5uZXdDaGFubmVsTGlzdGVuZXIoY2hhbm5lbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgb25DbGllbnRVbnN1YnNjcmliZShjbGllbnQsIGNoYW5uZWwpIHtcclxuICAgICAgICBpZiAoY2hhbm5lbCBpbiB0aGlzLmNoYW5uZWxzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbHNbY2hhbm5lbF0ucmVtb3ZlQ2xpZW50KGNsaWVudCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoYW5uZWxzW2NoYW5uZWxdLmlzRW1wdHkpIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmNoYW5uZWxzW2NoYW5uZWxdO1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgY2hhbm5lbCBpcyBlbXB0eSwgbm90aWZpZXMgdGhlIGxpc3RlbmVyXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5lbXB0eUNoYW5uZWxMaXN0ZW5lcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1wdHlDaGFubmVsTGlzdGVuZXIoY2hhbm5lbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBub3RpZnlBbGwoZGF0YSkge1xyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5jbGllbnRzKS5mb3JFYWNoKChjbGkpID0+IGNsaS5zZW5kKGRhdGEpKTtcclxuICAgIH1cclxuICAgIG5vdGlmeShjaGFubmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoYW5uZWxzW2NoYW5uZWxdKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5uZWxzW2NoYW5uZWxdLm5vdGlmeShkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuX19kZWNvcmF0ZShbXHJcbiAgICB1dGlsc18xLmRlY29yYXRvcnMubG9nKCdXU1MnLCB7IGxvZ0FyZ3VtZW50czogZmFsc2UgfSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFt3c18xLmRlZmF1bHRdKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCB2b2lkIDApXHJcbl0sIFdTUy5wcm90b3R5cGUsIFwib25OZXdDb25uZWN0aW9uXCIsIG51bGwpO1xyXG5fX2RlY29yYXRlKFtcclxuICAgIHV0aWxzXzEuZGVjb3JhdG9ycy5sb2coJ1dTUycsIHsgbG9nQXJndW1lbnRzOiBmYWxzZSB9KSxcclxuICAgIHV0aWxzXzEuZGVjb3JhdG9ycy5pbnRlcmNlcHQoe1xyXG4gICAgICAgIGJlZm9yZTogKG9iaiwgYXJncykgPT4gY29uc29sZS5sb2coYFdTUzogQ2xvc2luZyBjbGllbnQgJHthcmdzWzBdLmlkfWApLFxyXG4gICAgICAgIGFmdGVyOiAob2JqKSA9PiBjb25zb2xlLmxvZyhgV1NTOiAke09iamVjdC5rZXlzKG9iai5jbGllbnRzKS5sZW5ndGh9IGNsaWVudHMgbGVmdGApXHJcbiAgICB9KSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW0NsaWVudE1hbmFnZXJdKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCB2b2lkIDApXHJcbl0sIFdTUy5wcm90b3R5cGUsIFwib25DbGllbnRDbG9zZVwiLCBudWxsKTtcclxuX19kZWNvcmF0ZShbXHJcbiAgICB1dGlsc18xLmRlY29yYXRvcnMuaW50ZXJjZXB0KHsgYmVmb3JlOiAob2JqLCBhcmdzKSA9PiBjb25zb2xlLmxvZyhgV1NTOiBDbGllbnQgJHthcmdzWzBdLmlkfSBzdWJzY3JpcHRpb24gJHthcmdzWzFdfWApIH0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbQ2xpZW50TWFuYWdlciwgU3RyaW5nXSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgdm9pZCAwKVxyXG5dLCBXU1MucHJvdG90eXBlLCBcIm9uQ2xpZW50U3Vic2NyaWJlXCIsIG51bGwpO1xyXG5fX2RlY29yYXRlKFtcclxuICAgIHV0aWxzXzEuZGVjb3JhdG9ycy5pbnRlcmNlcHQoe1xyXG4gICAgICAgIGJlZm9yZTogKG9iaiwgYXJncykgPT4gY29uc29sZS5sb2coYFdTUzogQ2xpZW50ICR7YXJnc1swXS5pZH0gdW5zdWJzY3JpcHRpb24gJHthcmdzWzFdfWApLFxyXG4gICAgICAgIGFmdGVyOiAob2JqKSA9PiBjb25zb2xlLmxvZyhgV1NTOiAke09iamVjdC5rZXlzKG9iai5jaGFubmVscykubGVuZ3RofSBhbGl2ZWApXHJcbiAgICB9KSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW0NsaWVudE1hbmFnZXIsIFN0cmluZ10pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIHZvaWQgMClcclxuXSwgV1NTLnByb3RvdHlwZSwgXCJvbkNsaWVudFVuc3Vic2NyaWJlXCIsIG51bGwpO1xyXG5fX2RlY29yYXRlKFtcclxuICAgIHV0aWxzXzEuZGVjb3JhdG9ycy5pbnRlcmNlcHQoeyBiZWZvcmU6ICgpID0+IGNvbnNvbGUubG9nKGBXU1M6IE5vdGlmeWluZyBhbGxgKSB9KSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW09iamVjdF0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIHZvaWQgMClcclxuXSwgV1NTLnByb3RvdHlwZSwgXCJub3RpZnlBbGxcIiwgbnVsbCk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFdTUztcclxuIl19