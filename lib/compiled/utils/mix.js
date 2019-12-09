"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var db_1 = __importDefault(require("./db"));

var wss_1 = __importDefault(require("../utils/wss"));

var Mix =
/*#__PURE__*/
function () {
  function Mix(server) {
    (0, _classCallCheck2["default"])(this, Mix);
    this.wss = new wss_1["default"]();
    this.streams = {};
    this.wss.setup(server);
  }

  (0, _createClass2["default"])(Mix, [{
    key: "start",
    value: function start() {
      var _this = this;

      this.wss.setOnNewChannelListener(function (channel) {
        (function _callee() {
          var stream;
          return _regenerator["default"].async(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return _regenerator["default"].awrap(db_1["default"].listenToChanges(channel, []));

                case 2:
                  stream = _context.sent;
                  _this.streams[channel] = stream;
                  stream.setOnDataChanged(function (data) {
                    var obj = {};
                    obj["CH_".concat(channel.toUpperCase())] = data;

                    _this.wss.notify(channel)(obj);
                  });

                case 5:
                case "end":
                  return _context.stop();
              }
            }
          });
        })();
      });
      this.wss.setOnEmptyChannelListener(function (channel) {
        (function _callee2() {
          return _regenerator["default"].async(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  if (!(channel in _this.streams)) {
                    _context2.next = 6;
                    break;
                  }

                  _context2.next = 3;
                  return _regenerator["default"].awrap(_this.streams[channel].closeStream());

                case 3:
                  delete _this.streams[channel];
                  _context2.next = 7;
                  break;

                case 6:
                  console.log("Channel ".concat(channel, " not in streams, ").concat(Object.keys(_this.streams)));

                case 7:
                case "end":
                  return _context2.stop();
              }
            }
          });
        })();
      });
    }
  }]);
  return Mix;
}();

exports["default"] = Mix;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3RzL3V0aWxzL21peC5qcyJdLCJuYW1lcyI6WyJfX2ltcG9ydERlZmF1bHQiLCJtb2QiLCJfX2VzTW9kdWxlIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJleHBvcnRzIiwidmFsdWUiLCJkYl8xIiwicmVxdWlyZSIsIndzc18xIiwiTWl4Iiwic2VydmVyIiwid3NzIiwic3RyZWFtcyIsInNldHVwIiwic2V0T25OZXdDaGFubmVsTGlzdGVuZXIiLCJjaGFubmVsIiwibGlzdGVuVG9DaGFuZ2VzIiwic3RyZWFtIiwic2V0T25EYXRhQ2hhbmdlZCIsImRhdGEiLCJvYmoiLCJ0b1VwcGVyQ2FzZSIsIm5vdGlmeSIsInNldE9uRW1wdHlDaGFubmVsTGlzdGVuZXIiLCJjbG9zZVN0cmVhbSIsImNvbnNvbGUiLCJsb2ciLCJrZXlzIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7OztBQUNBLElBQUlBLGVBQWUsR0FBSSxVQUFRLFNBQUtBLGVBQWQsSUFBa0MsVUFBVUMsR0FBVixFQUFlO0FBQ25FLFNBQVFBLEdBQUcsSUFBSUEsR0FBRyxDQUFDQyxVQUFaLEdBQTBCRCxHQUExQixHQUFnQztBQUFFLGVBQVdBO0FBQWIsR0FBdkM7QUFDSCxDQUZEOztBQUdBRSxNQUFNLENBQUNDLGNBQVAsQ0FBc0JDLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUVDLEVBQUFBLEtBQUssRUFBRTtBQUFULENBQTdDOztBQUNBLElBQU1DLElBQUksR0FBR1AsZUFBZSxDQUFDUSxPQUFPLENBQUMsTUFBRCxDQUFSLENBQTVCOztBQUNBLElBQU1DLEtBQUssR0FBR1QsZUFBZSxDQUFDUSxPQUFPLENBQUMsY0FBRCxDQUFSLENBQTdCOztJQUNNRSxHOzs7QUFDRixlQUFZQyxNQUFaLEVBQW9CO0FBQUE7QUFDaEIsU0FBS0MsR0FBTCxHQUFXLElBQUlILEtBQUssV0FBVCxFQUFYO0FBQ0EsU0FBS0ksT0FBTCxHQUFlLEVBQWY7QUFDQSxTQUFLRCxHQUFMLENBQVNFLEtBQVQsQ0FBZUgsTUFBZjtBQUNIOzs7OzRCQUNPO0FBQUE7O0FBQ0osV0FBS0MsR0FBTCxDQUFTRyx1QkFBVCxDQUFpQyxVQUFBQyxPQUFPLEVBQUk7QUFDeEMsU0FBQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHVEQUN3QlQsSUFBSSxXQUFKLENBQWFVLGVBQWIsQ0FBNkJELE9BQTdCLEVBQXNDLEVBQXRDLENBRHhCOztBQUFBO0FBQ1NFLGtCQUFBQSxNQURUO0FBRUcsa0JBQUEsS0FBSSxDQUFDTCxPQUFMLENBQWFHLE9BQWIsSUFBd0JFLE1BQXhCO0FBQ0FBLGtCQUFBQSxNQUFNLENBQUNDLGdCQUFQLENBQXdCLFVBQUFDLElBQUksRUFBSTtBQUM1Qix3QkFBTUMsR0FBRyxHQUFHLEVBQVo7QUFDQUEsb0JBQUFBLEdBQUcsY0FBT0wsT0FBTyxDQUFDTSxXQUFSLEVBQVAsRUFBSCxHQUFxQ0YsSUFBckM7O0FBQ0Esb0JBQUEsS0FBSSxDQUFDUixHQUFMLENBQVNXLE1BQVQsQ0FBZ0JQLE9BQWhCLEVBQXlCSyxHQUF6QjtBQUNILG1CQUpEOztBQUhIO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBQUQ7QUFTSCxPQVZEO0FBV0EsV0FBS1QsR0FBTCxDQUFTWSx5QkFBVCxDQUFtQyxVQUFBUixPQUFPLEVBQUk7QUFDMUMsU0FBQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsd0JBQ09BLE9BQU8sSUFBSSxLQUFJLENBQUNILE9BRHZCO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsdURBRWEsS0FBSSxDQUFDQSxPQUFMLENBQWFHLE9BQWIsRUFBc0JTLFdBQXRCLEVBRmI7O0FBQUE7QUFHTyx5QkFBTyxLQUFJLENBQUNaLE9BQUwsQ0FBYUcsT0FBYixDQUFQO0FBSFA7QUFBQTs7QUFBQTtBQU1PVSxrQkFBQUEsT0FBTyxDQUFDQyxHQUFSLG1CQUF1QlgsT0FBdkIsOEJBQWtEYixNQUFNLENBQUN5QixJQUFQLENBQVksS0FBSSxDQUFDZixPQUFqQixDQUFsRDs7QUFOUDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUFEO0FBU0gsT0FWRDtBQVdIOzs7OztBQUVMUixPQUFPLFdBQVAsR0FBa0JLLEdBQWxCIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgZGJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9kYlwiKSk7XHJcbmNvbnN0IHdzc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi91dGlscy93c3NcIikpO1xyXG5jbGFzcyBNaXgge1xyXG4gICAgY29uc3RydWN0b3Ioc2VydmVyKSB7XHJcbiAgICAgICAgdGhpcy53c3MgPSBuZXcgd3NzXzEuZGVmYXVsdCgpO1xyXG4gICAgICAgIHRoaXMuc3RyZWFtcyA9IHt9O1xyXG4gICAgICAgIHRoaXMud3NzLnNldHVwKHNlcnZlcik7XHJcbiAgICB9XHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgICB0aGlzLndzcy5zZXRPbk5ld0NoYW5uZWxMaXN0ZW5lcihjaGFubmVsID0+IHtcclxuICAgICAgICAgICAgKGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN0cmVhbSA9IGF3YWl0IGRiXzEuZGVmYXVsdC5saXN0ZW5Ub0NoYW5nZXMoY2hhbm5lbCwgW10pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdHJlYW1zW2NoYW5uZWxdID0gc3RyZWFtO1xyXG4gICAgICAgICAgICAgICAgc3RyZWFtLnNldE9uRGF0YUNoYW5nZWQoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2JqID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqW2BDSF8ke2NoYW5uZWwudG9VcHBlckNhc2UoKX1gXSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53c3Mubm90aWZ5KGNoYW5uZWwpKG9iaik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSkoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLndzcy5zZXRPbkVtcHR5Q2hhbm5lbExpc3RlbmVyKGNoYW5uZWwgPT4ge1xyXG4gICAgICAgICAgICAoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoYW5uZWwgaW4gdGhpcy5zdHJlYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5zdHJlYW1zW2NoYW5uZWxdLmNsb3NlU3RyZWFtKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuc3RyZWFtc1tjaGFubmVsXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBDaGFubmVsICR7Y2hhbm5lbH0gbm90IGluIHN0cmVhbXMsICR7T2JqZWN0LmtleXModGhpcy5zdHJlYW1zKX1gKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBNaXg7XHJcbiJdfQ==