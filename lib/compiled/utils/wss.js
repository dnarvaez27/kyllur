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
                  args: {
                    data: {
                      latitude: latitude,
                      longitude: longitude
                    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3RzL3V0aWxzL3dzcy5qcyJdLCJuYW1lcyI6WyJfX2RlY29yYXRlIiwiZGVjb3JhdG9ycyIsInRhcmdldCIsImtleSIsImRlc2MiLCJjIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiciIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImQiLCJSZWZsZWN0IiwiZGVjb3JhdGUiLCJpIiwiZGVmaW5lUHJvcGVydHkiLCJfX21ldGFkYXRhIiwiayIsInYiLCJtZXRhZGF0YSIsIl9faW1wb3J0RGVmYXVsdCIsIm1vZCIsIl9fZXNNb2R1bGUiLCJfX2ltcG9ydFN0YXIiLCJyZXN1bHQiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJleHBvcnRzIiwidmFsdWUiLCJ3c18xIiwicmVxdWlyZSIsImFwaV8xIiwiZGJfMSIsInV0aWxzXzEiLCJERUxUQV9JTlRFUlZBTCIsImdldEVudlZhciIsIkluZmluaXR5IiwiUFJPVE9DT0wiLCJNZXNzYWdlIiwibXNnIiwiZGF0YSIsInNwbGl0IiwiU0VQQVJBVE9SIiwidHlwZSIsImFyZ3MiLCJzbGljZSIsIkxPQ0FUSU9OIiwiaXNMb2NhdGlvbiIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwiRXJyb3IiLCJTVUJTQ1JJQkUiLCJDbGllbnRNYW5hZ2VyIiwid3MiLCJpZCIsIm9uQ2xvc2UiLCJvblN1YnNjcmliZSIsIm9uVW5zdWJzY3JpYmUiLCJvbk1lc3NhZ2UiLCJjbGllbnRJbnRlcnZhbCIsInVuZGVmaW5lZCIsInN1YnNjcmliZWRDaGFubmVscyIsImNoYW5ubmVsIiwib24iLCJvbk5ld01lc3NhZ2UiLCJiaW5kIiwic3RybWVzc2FnZSIsIm1lc3NhZ2UiLCJvbkxvY2F0aW9uUmVjZWl2ZWQiLCJpc1N1YnNjcmlwdGlvbiIsIm9uU3Vic2NyaXB0aW9uUmVjZWl2ZWQiLCJwcm90b2NvbCIsImNoYW5uZWwiLCJnZXRTdWJzY3JpcHRpb25DaGFubmVsIiwiam9pbiIsIkNIQU5ORUxfU0VQQVJBVE9SIiwiSU5GTyIsInNlbmQiLCJwdXNoIiwiY29vcmRpbmF0ZXMiLCJnZXRMb2NhdGlvbiIsImFkZExvY2F0aW9uVG9EQiIsImluaXRJbnRlcnZhbCIsImNsZWFyQ2xpZW50SW50ZXJ2YWwiLCJzZW5kUmVzcG9uc2VMb2NhdGlvbiIsInNldEludGVydmFsIiwiZ2V0U2F0ZWxsaXRlcyIsInNhdGVsbGl0ZXMiLCJnZXRTdGFycyIsInN0YXJzIiwiTElWRSIsImV4ZWNRdWVyeSIsIkZ1bmN0aW9ucyIsImNyZWF0ZU9uZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJjbGVhckludGVydmFsIiwiY2xvc2UiLCJsb2ciLCJGdW5jdGlvbiIsIlN0cmluZyIsInByb3RvdHlwZSIsImxvZ0FyZ3VtZW50cyIsIkNoYW5uZWwiLCJuYW1lIiwiY2xpZW50cyIsImNsaWVudCIsInZhbHVlcyIsImZvckVhY2giLCJpbnRlcmNlcHQiLCJiZWZvcmUiLCJvYmoiLCJjb25zb2xlIiwiV1NTIiwid3NzIiwiY2hhbm5lbHMiLCJjbGllbnRzQ291bnQiLCJuZXdDaGFubmVsTGlzdGVuZXIiLCJlbXB0eUNoYW5uZWxMaXN0ZW5lciIsIm9uQ2xpZW50Q2xvc2UiLCJvbkNsaWVudFN1YnNjcmliZSIsIm9uQ2xpZW50VW5zdWJzY3JpYmUiLCJub3RpZnlBbGwiLCJub3RpZnkiLCJzZXR1cCIsIm9uTmV3Q29ubmVjdGlvbiIsInNlcnZlciIsIlNlcnZlciIsIm1lc3NhZ2VMaXN0ZW5lciIsImNoIiwibmV3Q2hhbm5lbCIsImFkZENsaWVudCIsInJlbW92ZUNsaWVudCIsImlzRW1wdHkiLCJjbGkiLCJhZnRlciIsImtleXMiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7QUFDQSxJQUFJQSxVQUFVLEdBQUksVUFBUSxTQUFLQSxVQUFkLElBQTZCLFVBQVVDLFVBQVYsRUFBc0JDLE1BQXRCLEVBQThCQyxHQUE5QixFQUFtQ0MsSUFBbkMsRUFBeUM7QUFDbkYsTUFBSUMsQ0FBQyxHQUFHQyxTQUFTLENBQUNDLE1BQWxCO0FBQUEsTUFBMEJD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QUFoQixDQUxILEVBTVBuRixVQUFVLENBQUMsbUJBQUQsRUFBc0IsQ0FBQ29DLGFBQUQsRUFBZ0JnRCxNQUFoQixDQUF0QixDQU5ILEVBT1BwRixVQUFVLENBQUMsbUJBQUQsRUFBc0IsS0FBSyxDQUEzQixDQVBILENBQUQsRUFRUGlHLEdBQUcsQ0FBQ1osU0FSRyxFQVFRLHFCQVJSLEVBUStCLElBUi9CLENBQVY7O0FBU0FyRyxVQUFVLENBQUMsQ0FDUGlDLE9BQU8sQ0FBQ2hDLFVBQVIsQ0FBbUI0RyxTQUFuQixDQUE2QjtBQUFFQyxFQUFBQSxNQUFNLEVBQUU7QUFBQSxXQUFNRSxPQUFPLENBQUNkLEdBQVIsc0JBQU47QUFBQTtBQUFWLENBQTdCLENBRE8sRUFFUGxGLFVBQVUsQ0FBQyxhQUFELEVBQWdCbUYsUUFBaEIsQ0FGSCxFQUdQbkYsVUFBVSxDQUFDLG1CQUFELEVBQXNCLENBQUNQLE1BQUQsQ0FBdEIsQ0FISCxFQUlQTyxVQUFVLENBQUMsbUJBQUQsRUFBc0IsS0FBSyxDQUEzQixDQUpILENBQUQsRUFLUGlHLEdBQUcsQ0FBQ1osU0FMRyxFQUtRLFdBTFIsRUFLcUIsSUFMckIsQ0FBVjs7QUFNQTFFLE9BQU8sV0FBUCxHQUFrQnNGLEdBQWxCIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2RlY29yYXRlID0gKHRoaXMgJiYgdGhpcy5fX2RlY29yYXRlKSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn07XHJcbnZhciBfX21ldGFkYXRhID0gKHRoaXMgJiYgdGhpcy5fX21ldGFkYXRhKSB8fCBmdW5jdGlvbiAoaywgdikge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKGssIHYpO1xyXG59O1xyXG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xyXG59O1xyXG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IGZ1bmN0aW9uIChtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgcmVzdWx0W2tdID0gbW9kW2tdO1xyXG4gICAgcmVzdWx0W1wiZGVmYXVsdFwiXSA9IG1vZDtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3Qgd3NfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwid3NcIikpO1xyXG5jb25zdCBhcGlfMSA9IHJlcXVpcmUoXCIuL2FwaVwiKTtcclxuY29uc3QgZGJfMSA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiLi9kYlwiKSk7XHJcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcclxuY29uc3QgREVMVEFfSU5URVJWQUwgPSArKHV0aWxzXzEuZ2V0RW52VmFyKCdERUxUQV9JTlRFUlZBTCcsIEluZmluaXR5KSk7XHJcbnZhciBQUk9UT0NPTDtcclxuKGZ1bmN0aW9uIChQUk9UT0NPTCkge1xyXG4gICAgUFJPVE9DT0xbXCJMT0NBVElPTlwiXSA9IFwiTE9DQVRJT05cIjtcclxuICAgIFBST1RPQ09MW1wiU1VCU0NSSUJFXCJdID0gXCJTVUJTQ1JJQkVcIjtcclxuICAgIFBST1RPQ09MW1wiTElWRVwiXSA9IFwiTElWRVwiO1xyXG4gICAgUFJPVE9DT0xbXCJJTkZPXCJdID0gXCJJTkZPXCI7XHJcbiAgICBQUk9UT0NPTFtcIlNFUEFSQVRPUlwiXSA9IFwiO1wiO1xyXG4gICAgUFJPVE9DT0xbXCJDSEFOTkVMX1NFUEFSQVRPUlwiXSA9IFwiQFwiO1xyXG59KShQUk9UT0NPTCB8fCAoUFJPVE9DT0wgPSB7fSkpO1xyXG5jbGFzcyBNZXNzYWdlIHtcclxuICAgIGNvbnN0cnVjdG9yKG1zZykge1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBtc2cuc3BsaXQoUFJPVE9DT0wuU0VQQVJBVE9SKTtcclxuICAgICAgICB0aGlzLnR5cGUgPSBkYXRhWzBdO1xyXG4gICAgICAgIHRoaXMuYXJncyA9IGRhdGEuc2xpY2UoMSk7XHJcbiAgICB9XHJcbiAgICBpc0xvY2F0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnR5cGUgPT09IFBST1RPQ09MLkxPQ0FUSU9OO1xyXG4gICAgfVxyXG4gICAgZ2V0TG9jYXRpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNMb2NhdGlvbigpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IGxhdGl0dWRlOiArdGhpcy5hcmdzWzBdLCBsb25naXR1ZGU6ICt0aGlzLmFyZ3NbMV0gfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhyb3cgRXJyb3IoYE1lc3NhZ2UgaXMgbm90IExPQ0FUSU9OICR7dGhpcy50eXBlfTogJHt0aGlzLmFyZ3N9YCk7XHJcbiAgICB9XHJcbiAgICBpc1N1YnNjcmlwdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50eXBlID09PSBQUk9UT0NPTC5TVUJTQ1JJQkU7XHJcbiAgICB9XHJcbiAgICBnZXRTdWJzY3JpcHRpb25DaGFubmVsKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFyZ3M7XHJcbiAgICB9XHJcbn1cclxuY2xhc3MgQ2xpZW50TWFuYWdlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcih3cywgaWQsIG9uQ2xvc2UsIG9uU3Vic2NyaWJlLCBvblVuc3Vic2NyaWJlLCBvbk1lc3NhZ2UpIHtcclxuICAgICAgICB0aGlzLmNsaWVudEludGVydmFsID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLndzID0gd3M7XHJcbiAgICAgICAgdGhpcy5zdWJzY3JpYmVkQ2hhbm5lbHMgPSBbXTtcclxuICAgICAgICB0aGlzLm9uU3Vic2NyaWJlID0gKGNoYW5ubmVsKSA9PiBvblN1YnNjcmliZSh0aGlzLCBjaGFubm5lbCk7XHJcbiAgICAgICAgdGhpcy5vblVuc3Vic2NyaWJlID0gKGNoYW5ubmVsKSA9PiBvblVuc3Vic2NyaWJlKHRoaXMsIGNoYW5ubmVsKTtcclxuICAgICAgICB0aGlzLm9uTWVzc2FnZSA9IG9uTWVzc2FnZTtcclxuICAgICAgICB3cy5vbignbWVzc2FnZScsIHRoaXMub25OZXdNZXNzYWdlLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHdzLm9uKCdjbG9zZScsIHRoaXMub25DbG9zZShvbkNsb3NlKS5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuICAgIG9uTmV3TWVzc2FnZShzdHJtZXNzYWdlKSB7XHJcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IG5ldyBNZXNzYWdlKHN0cm1lc3NhZ2UpO1xyXG4gICAgICAgIGlmICh0aGlzLm9uTWVzc2FnZSkge1xyXG4gICAgICAgICAgICB0aGlzLm9uTWVzc2FnZShtZXNzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG1lc3NhZ2UuaXNMb2NhdGlvbigpKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25Mb2NhdGlvblJlY2VpdmVkKG1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChtZXNzYWdlLmlzU3Vic2NyaXB0aW9uKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5vblN1YnNjcmlwdGlvblJlY2VpdmVkKG1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG9uU3Vic2NyaXB0aW9uUmVjZWl2ZWQocHJvdG9jb2wpIHtcclxuICAgICAgICBjb25zdCBjaGFubmVsID0gcHJvdG9jb2wuZ2V0U3Vic2NyaXB0aW9uQ2hhbm5lbCgpLmpvaW4oUFJPVE9DT0wuQ0hBTk5FTF9TRVBBUkFUT1IpO1xyXG4gICAgICAgIGNvbnN0IG1zZyA9IHt9O1xyXG4gICAgICAgIG1zZ1tQUk9UT0NPTC5JTkZPXSA9IHsgbXNnOiBgU3Vic2NyaWJlZCB0byAke2NoYW5uZWx9YCB9O1xyXG4gICAgICAgIHRoaXMuc2VuZChtc2cpO1xyXG4gICAgICAgIHRoaXMuc3Vic2NyaWJlZENoYW5uZWxzLnB1c2goY2hhbm5lbCk7XHJcbiAgICAgICAgdGhpcy5vblN1YnNjcmliZShjaGFubmVsKTtcclxuICAgIH1cclxuICAgIG9uTG9jYXRpb25SZWNlaXZlZChwcm90b2NvbCkge1xyXG4gICAgICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gcHJvdG9jb2wuZ2V0TG9jYXRpb24oKTtcclxuICAgICAgICB0aGlzLmFkZExvY2F0aW9uVG9EQihjb29yZGluYXRlcyk7XHJcbiAgICAgICAgdGhpcy5pbml0SW50ZXJ2YWwoY29vcmRpbmF0ZXMpO1xyXG4gICAgfVxyXG4gICAgaW5pdEludGVydmFsKGNvb3JkaW5hdGVzKSB7XHJcbiAgICAgICAgdGhpcy5jbGVhckNsaWVudEludGVydmFsKCk7XHJcbiAgICAgICAgdGhpcy5zZW5kUmVzcG9uc2VMb2NhdGlvbihjb29yZGluYXRlcyk7XHJcbiAgICAgICAgdGhpcy5jbGllbnRJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHRoaXMuc2VuZFJlc3BvbnNlTG9jYXRpb24oY29vcmRpbmF0ZXMpLCBERUxUQV9JTlRFUlZBTCk7XHJcbiAgICB9XHJcbiAgICBzZW5kUmVzcG9uc2VMb2NhdGlvbih7IGxhdGl0dWRlLCBsb25naXR1ZGUgfSkge1xyXG4gICAgICAgIChhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNhdGVsbGl0ZXMgPSBhd2FpdCBhcGlfMS5nZXRTYXRlbGxpdGVzKGxhdGl0dWRlLCBsb25naXR1ZGUpO1xyXG4gICAgICAgICAgICBjb25zdCBzdGFycyA9IGF3YWl0IGFwaV8xLmdldFN0YXJzKGxhdGl0dWRlLCBsb25naXR1ZGUpO1xyXG4gICAgICAgICAgICBjb25zdCBtc2cgPSB7fTtcclxuICAgICAgICAgICAgbXNnW1BST1RPQ09MLkxJVkVdID0geyBzYXRlbGxpdGVzLCBzdGFycyB9O1xyXG4gICAgICAgICAgICB0aGlzLnNlbmQobXNnKTtcclxuICAgICAgICB9KSgpO1xyXG4gICAgfVxyXG4gICAgLy8gTk9URTogQ2hlY2sgaWYgcmVhbGxvY2F0ZSBpbnRvIGFub3RoZXIgY29tcG9uZW50XHJcbiAgICBhZGRMb2NhdGlvblRvREIoeyBsYXRpdHVkZSwgbG9uZ2l0dWRlIH0pIHtcclxuICAgICAgICAoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCBkYl8xLmRlZmF1bHQuZXhlY1F1ZXJ5KGRiXzEuRnVuY3Rpb25zLmNyZWF0ZU9uZSwgJ2xvY2F0aW9ucycsIHt9LCB7IGFyZ3M6IHsgZGF0YTogeyBsYXRpdHVkZSwgbG9uZ2l0dWRlIH0gfSB9KTtcclxuICAgICAgICB9KSgpO1xyXG4gICAgfVxyXG4gICAgc2VuZChkYXRhKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBkYXRhID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICB0aGlzLndzLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy53cy5zZW5kKGAke2RhdGF9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2xlYXJDbGllbnRJbnRlcnZhbCgpIHtcclxuICAgICAgICBpZiAodGhpcy5jbGllbnRJbnRlcnZhbCkge1xyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuY2xpZW50SW50ZXJ2YWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG9uQ2xvc2UoY2xvc2UpIHtcclxuICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jbGllbnRJbnRlcnZhbCkge1xyXG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmNsaWVudEludGVydmFsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjbG9zZSh0aGlzKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgdXRpbHNfMS5kZWNvcmF0b3JzLmxvZygnV1MnKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW1N0cmluZ10pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIHZvaWQgMClcclxuXSwgQ2xpZW50TWFuYWdlci5wcm90b3R5cGUsIFwib25OZXdNZXNzYWdlXCIsIG51bGwpO1xyXG5fX2RlY29yYXRlKFtcclxuICAgIHV0aWxzXzEuZGVjb3JhdG9ycy5sb2coJ1dTJyksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtNZXNzYWdlXSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgdm9pZCAwKVxyXG5dLCBDbGllbnRNYW5hZ2VyLnByb3RvdHlwZSwgXCJvblN1YnNjcmlwdGlvblJlY2VpdmVkXCIsIG51bGwpO1xyXG5fX2RlY29yYXRlKFtcclxuICAgIHV0aWxzXzEuZGVjb3JhdG9ycy5sb2coJ1dTJyksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtNZXNzYWdlXSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgdm9pZCAwKVxyXG5dLCBDbGllbnRNYW5hZ2VyLnByb3RvdHlwZSwgXCJvbkxvY2F0aW9uUmVjZWl2ZWRcIiwgbnVsbCk7XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgdXRpbHNfMS5kZWNvcmF0b3JzLmxvZygnV1MnKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW09iamVjdF0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIHZvaWQgMClcclxuXSwgQ2xpZW50TWFuYWdlci5wcm90b3R5cGUsIFwic2VuZFJlc3BvbnNlTG9jYXRpb25cIiwgbnVsbCk7XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgdXRpbHNfMS5kZWNvcmF0b3JzLmxvZygnV1MnKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW09iamVjdF0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIHZvaWQgMClcclxuXSwgQ2xpZW50TWFuYWdlci5wcm90b3R5cGUsIFwiYWRkTG9jYXRpb25Ub0RCXCIsIG51bGwpO1xyXG5fX2RlY29yYXRlKFtcclxuICAgIHV0aWxzXzEuZGVjb3JhdG9ycy5sb2coJ1dTJywgeyBsb2dBcmd1bWVudHM6IGZhbHNlIH0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbT2JqZWN0XSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgdm9pZCAwKVxyXG5dLCBDbGllbnRNYW5hZ2VyLnByb3RvdHlwZSwgXCJzZW5kXCIsIG51bGwpO1xyXG5jbGFzcyBDaGFubmVsIHtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuY2xpZW50cyA9IHt9O1xyXG4gICAgfVxyXG4gICAgYWRkQ2xpZW50KGNsaWVudCkge1xyXG4gICAgICAgIHRoaXMuY2xpZW50c1tjbGllbnQuaWRdID0gY2xpZW50O1xyXG4gICAgfVxyXG4gICAgcmVtb3ZlQ2xpZW50KGNsaWVudCkge1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLmNsaWVudHNbY2xpZW50LmlkXTtcclxuICAgIH1cclxuICAgIG5vdGlmeShkYXRhKSB7XHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLmNsaWVudHMpLmZvckVhY2goYyA9PiBjLnNlbmQoZGF0YSkpO1xyXG4gICAgfVxyXG4gICAgZ2V0IGlzRW1wdHkoKSB7XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5jbGllbnRzKS5sZW5ndGggPT09IDA7XHJcbiAgICB9XHJcbn1cclxuX19kZWNvcmF0ZShbXHJcbiAgICB1dGlsc18xLmRlY29yYXRvcnMuaW50ZXJjZXB0KHsgYmVmb3JlOiAob2JqKSA9PiBjb25zb2xlLmxvZyhgQ2hhbm5lbDogTm90aWZ5aW5nICR7b2JqLm5hbWV9YCkgfSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtPYmplY3RdKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCB2b2lkIDApXHJcbl0sIENoYW5uZWwucHJvdG90eXBlLCBcIm5vdGlmeVwiLCBudWxsKTtcclxuY2xhc3MgV1NTIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMud3NzID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMuY2xpZW50cyA9IHt9O1xyXG4gICAgICAgIHRoaXMuY2hhbm5lbHMgPSB7fTtcclxuICAgICAgICB0aGlzLmNsaWVudHNDb3VudCA9IDA7XHJcbiAgICAgICAgdGhpcy5uZXdDaGFubmVsTGlzdGVuZXIgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5lbXB0eUNoYW5uZWxMaXN0ZW5lciA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLm9uQ2xpZW50Q2xvc2UgPSB0aGlzLm9uQ2xpZW50Q2xvc2UuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLm9uQ2xpZW50U3Vic2NyaWJlID0gdGhpcy5vbkNsaWVudFN1YnNjcmliZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMub25DbGllbnRVbnN1YnNjcmliZSA9IHRoaXMub25DbGllbnRVbnN1YnNjcmliZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMubm90aWZ5QWxsID0gdGhpcy5ub3RpZnlBbGwuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLm5vdGlmeSA9IHRoaXMubm90aWZ5LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5zZXR1cCA9IHRoaXMuc2V0dXAuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLm9uTmV3Q29ubmVjdGlvbiA9IHRoaXMub25OZXdDb25uZWN0aW9uLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBzZXR1cChzZXJ2ZXIpIHtcclxuICAgICAgICB0aGlzLndzcyA9IG5ldyB3c18xLmRlZmF1bHQuU2VydmVyKHNlcnZlcik7XHJcbiAgICAgICAgdGhpcy53c3Mub24oJ2Nvbm5lY3Rpb24nLCB0aGlzLm9uTmV3Q29ubmVjdGlvbik7XHJcbiAgICB9XHJcbiAgICBvbk5ld0Nvbm5lY3Rpb24od3MpIHtcclxuICAgICAgICBjb25zdCBjbGllbnQgPSBuZXcgQ2xpZW50TWFuYWdlcih3cywgdGhpcy5jbGllbnRzQ291bnQrKywgdGhpcy5vbkNsaWVudENsb3NlLCB0aGlzLm9uQ2xpZW50U3Vic2NyaWJlLCB0aGlzLm9uQ2xpZW50VW5zdWJzY3JpYmUsIHRoaXMubWVzc2FnZUxpc3RlbmVyICYmIHRoaXMubWVzc2FnZUxpc3RlbmVyLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuY2xpZW50c1tjbGllbnQuaWRdID0gY2xpZW50O1xyXG4gICAgfVxyXG4gICAgc2V0T25OZXdDaGFubmVsTGlzdGVuZXIobmV3Q2hhbm5lbExpc3RlbmVyKSB7XHJcbiAgICAgICAgdGhpcy5uZXdDaGFubmVsTGlzdGVuZXIgPSBuZXdDaGFubmVsTGlzdGVuZXI7XHJcbiAgICB9XHJcbiAgICBzZXRPbkVtcHR5Q2hhbm5lbExpc3RlbmVyKGVtcHR5Q2hhbm5lbExpc3RlbmVyKSB7XHJcbiAgICAgICAgdGhpcy5lbXB0eUNoYW5uZWxMaXN0ZW5lciA9IGVtcHR5Q2hhbm5lbExpc3RlbmVyO1xyXG4gICAgfVxyXG4gICAgc2V0T25OZXdNZXNzYWdlTGlzdGVuZXIobWVzc2FnZUxpc3RlbmVyKSB7XHJcbiAgICAgICAgdGhpcy5tZXNzYWdlTGlzdGVuZXIgPSBtZXNzYWdlTGlzdGVuZXI7XHJcbiAgICB9XHJcbiAgICBvbkNsaWVudENsb3NlKGNsaWVudCkge1xyXG4gICAgICAgIGNsaWVudC5zdWJzY3JpYmVkQ2hhbm5lbHMuZm9yRWFjaChjaCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMub25DbGllbnRVbnN1YnNjcmliZShjbGllbnQsIGNoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBkZWxldGUgdGhpcy5jbGllbnRzW2NsaWVudC5pZF07XHJcbiAgICB9XHJcbiAgICBvbkNsaWVudFN1YnNjcmliZShjbGllbnQsIGNoYW5uZWwpIHtcclxuICAgICAgICBsZXQgbmV3Q2hhbm5lbCA9IGZhbHNlO1xyXG4gICAgICAgIGlmICghKGNoYW5uZWwgaW4gdGhpcy5jaGFubmVscykpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFubmVsc1tjaGFubmVsXSA9IG5ldyBDaGFubmVsKGNoYW5uZWwpO1xyXG4gICAgICAgICAgICBuZXdDaGFubmVsID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jaGFubmVsc1tjaGFubmVsXS5hZGRDbGllbnQoY2xpZW50KTtcclxuICAgICAgICBpZiAobmV3Q2hhbm5lbCAmJiB0aGlzLm5ld0NoYW5uZWxMaXN0ZW5lcikge1xyXG4gICAgICAgICAgICB0aGlzLm5ld0NoYW5uZWxMaXN0ZW5lcihjaGFubmVsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBvbkNsaWVudFVuc3Vic2NyaWJlKGNsaWVudCwgY2hhbm5lbCkge1xyXG4gICAgICAgIGlmIChjaGFubmVsIGluIHRoaXMuY2hhbm5lbHMpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFubmVsc1tjaGFubmVsXS5yZW1vdmVDbGllbnQoY2xpZW50KTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hhbm5lbHNbY2hhbm5lbF0uaXNFbXB0eSkge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuY2hhbm5lbHNbY2hhbm5lbF07XHJcbiAgICAgICAgICAgICAgICAvLyBJZiBjaGFubmVsIGlzIGVtcHR5LCBub3RpZmllcyB0aGUgbGlzdGVuZXJcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmVtcHR5Q2hhbm5lbExpc3RlbmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbXB0eUNoYW5uZWxMaXN0ZW5lcihjaGFubmVsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG5vdGlmeUFsbChkYXRhKSB7XHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLmNsaWVudHMpLmZvckVhY2goKGNsaSkgPT4gY2xpLnNlbmQoZGF0YSkpO1xyXG4gICAgfVxyXG4gICAgbm90aWZ5KGNoYW5uZWwpIHtcclxuICAgICAgICByZXR1cm4gKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hhbm5lbHNbY2hhbm5lbF0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhbm5lbHNbY2hhbm5lbF0ubm90aWZ5KGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5fX2RlY29yYXRlKFtcclxuICAgIHV0aWxzXzEuZGVjb3JhdG9ycy5sb2coJ1dTUycsIHsgbG9nQXJndW1lbnRzOiBmYWxzZSB9KSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW3dzXzEuZGVmYXVsdF0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIHZvaWQgMClcclxuXSwgV1NTLnByb3RvdHlwZSwgXCJvbk5ld0Nvbm5lY3Rpb25cIiwgbnVsbCk7XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgdXRpbHNfMS5kZWNvcmF0b3JzLmxvZygnV1NTJywgeyBsb2dBcmd1bWVudHM6IGZhbHNlIH0pLFxyXG4gICAgdXRpbHNfMS5kZWNvcmF0b3JzLmludGVyY2VwdCh7XHJcbiAgICAgICAgYmVmb3JlOiAob2JqLCBhcmdzKSA9PiBjb25zb2xlLmxvZyhgV1NTOiBDbG9zaW5nIGNsaWVudCAke2FyZ3NbMF0uaWR9YCksXHJcbiAgICAgICAgYWZ0ZXI6IChvYmopID0+IGNvbnNvbGUubG9nKGBXU1M6ICR7T2JqZWN0LmtleXMob2JqLmNsaWVudHMpLmxlbmd0aH0gY2xpZW50cyBsZWZ0YClcclxuICAgIH0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbQ2xpZW50TWFuYWdlcl0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIHZvaWQgMClcclxuXSwgV1NTLnByb3RvdHlwZSwgXCJvbkNsaWVudENsb3NlXCIsIG51bGwpO1xyXG5fX2RlY29yYXRlKFtcclxuICAgIHV0aWxzXzEuZGVjb3JhdG9ycy5pbnRlcmNlcHQoeyBiZWZvcmU6IChvYmosIGFyZ3MpID0+IGNvbnNvbGUubG9nKGBXU1M6IENsaWVudCAke2FyZ3NbMF0uaWR9IHN1YnNjcmlwdGlvbiAke2FyZ3NbMV19YCkgfSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtDbGllbnRNYW5hZ2VyLCBTdHJpbmddKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cmV0dXJudHlwZVwiLCB2b2lkIDApXHJcbl0sIFdTUy5wcm90b3R5cGUsIFwib25DbGllbnRTdWJzY3JpYmVcIiwgbnVsbCk7XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgdXRpbHNfMS5kZWNvcmF0b3JzLmludGVyY2VwdCh7XHJcbiAgICAgICAgYmVmb3JlOiAob2JqLCBhcmdzKSA9PiBjb25zb2xlLmxvZyhgV1NTOiBDbGllbnQgJHthcmdzWzBdLmlkfSB1bnN1YnNjcmlwdGlvbiAke2FyZ3NbMV19YCksXHJcbiAgICAgICAgYWZ0ZXI6IChvYmopID0+IGNvbnNvbGUubG9nKGBXU1M6ICR7T2JqZWN0LmtleXMob2JqLmNoYW5uZWxzKS5sZW5ndGh9IGFsaXZlYClcclxuICAgIH0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbQ2xpZW50TWFuYWdlciwgU3RyaW5nXSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgdm9pZCAwKVxyXG5dLCBXU1MucHJvdG90eXBlLCBcIm9uQ2xpZW50VW5zdWJzY3JpYmVcIiwgbnVsbCk7XHJcbl9fZGVjb3JhdGUoW1xyXG4gICAgdXRpbHNfMS5kZWNvcmF0b3JzLmludGVyY2VwdCh7IGJlZm9yZTogKCkgPT4gY29uc29sZS5sb2coYFdTUzogTm90aWZ5aW5nIGFsbGApIH0pLFxyXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIEZ1bmN0aW9uKSxcclxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbT2JqZWN0XSksXHJcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgdm9pZCAwKVxyXG5dLCBXU1MucHJvdG90eXBlLCBcIm5vdGlmeUFsbFwiLCBudWxsKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gV1NTO1xyXG4iXX0=