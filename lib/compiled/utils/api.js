"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var __importStar = void 0 && (void 0).__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var db_1 = __importStar(require("./db"));

var utils_1 = require("./utils");

var node_fetch_1 = __importDefault(require("node-fetch"));

var N2YO_KEY = utils_1.getEnvVar('N2YO_KEY');
var N2YO_HOST = 'https://www.n2yo.com/rest/v1/satellite/above';
var N2YO_ALT = 0;
var N2YO_DEG = 70;
var N2YO_CATEGORY = 32;

var URL = function URL(latitude, longitude) {
  return "".concat(N2YO_HOST, "/").concat(latitude, "/").concat(longitude, "/").concat(N2YO_ALT, "/").concat(N2YO_DEG, "/").concat(N2YO_CATEGORY, "/&apiKey=").concat(N2YO_KEY);
};

;
var sideralTime = {
  deltaJ: 86400000,
  L0: 99.967794687,
  L1: 360.98564736628603,
  L2: 0.0000002907879,
  calculate: function calculate(longitude) {
    var time = new Date().getDate();
    return (this.L0 + this.L1 * this.deltaJ * time + this.L2 * Math.pow(this.deltaJ * time, 2) - longitude) % 360;
  }
};

function getSatellites(latitude, longitude) {
  var mySideral, req, satellites;
  return _regenerator["default"].async(function getSatellites$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          mySideral = sideralTime.calculate(longitude);
          _context.next = 3;
          return _regenerator["default"].awrap(node_fetch_1["default"](URL(latitude, longitude)));

        case 3:
          req = _context.sent;
          _context.next = 6;
          return _regenerator["default"].awrap(req.json());

        case 6:
          satellites = _context.sent;
          return _context.abrupt("return", satellites.above.map(function (s) {
            var ra = sideralTime.calculate(s.satlng);
            return _objectSpread({}, s, {
              canvasPosition: {
                x: ra - mySideral,
                y: s.satlat - latitude
              }
            });
          }));

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
}

exports.getSatellites = getSatellites;

function getStars(latitude, longitude) {
  var mySideral, filteredStars;
  return _regenerator["default"].async(function getStars$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          mySideral = sideralTime.calculate(longitude);
          _context2.next = 3;
          return _regenerator["default"].awrap(db_1["default"].execQuery(db_1.Functions.get, 'stars', {
            $where: function $where() {
              return Math.sqrt(Math.pow(this.ra - mySideral, 2) + Math.pow(this.dec - latitude, 2)) <= 70;
            }
          }));

        case 3:
          filteredStars = _context2.sent;
          return _context2.abrupt("return", filteredStars.map(function (s) {
            return _objectSpread({}, s, {
              canvasPosition: {
                x: s.ra - mySideral,
                y: s.dec - latitude
              }
            });
          }));

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
}

exports.getStars = getStars;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3RzL3V0aWxzL2FwaS5qcyJdLCJuYW1lcyI6WyJfX2ltcG9ydFN0YXIiLCJtb2QiLCJfX2VzTW9kdWxlIiwicmVzdWx0IiwiayIsIk9iamVjdCIsImhhc093blByb3BlcnR5IiwiY2FsbCIsIl9faW1wb3J0RGVmYXVsdCIsImRlZmluZVByb3BlcnR5IiwiZXhwb3J0cyIsInZhbHVlIiwiZGJfMSIsInJlcXVpcmUiLCJ1dGlsc18xIiwibm9kZV9mZXRjaF8xIiwiTjJZT19LRVkiLCJnZXRFbnZWYXIiLCJOMllPX0hPU1QiLCJOMllPX0FMVCIsIk4yWU9fREVHIiwiTjJZT19DQVRFR09SWSIsIlVSTCIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwic2lkZXJhbFRpbWUiLCJkZWx0YUoiLCJMMCIsIkwxIiwiTDIiLCJjYWxjdWxhdGUiLCJ0aW1lIiwiRGF0ZSIsImdldERhdGUiLCJNYXRoIiwicG93IiwiZ2V0U2F0ZWxsaXRlcyIsIm15U2lkZXJhbCIsInJlcSIsImpzb24iLCJzYXRlbGxpdGVzIiwiYWJvdmUiLCJtYXAiLCJzIiwicmEiLCJzYXRsbmciLCJjYW52YXNQb3NpdGlvbiIsIngiLCJ5Iiwic2F0bGF0IiwiZ2V0U3RhcnMiLCJleGVjUXVlcnkiLCJGdW5jdGlvbnMiLCJnZXQiLCIkd2hlcmUiLCJzcXJ0IiwiZGVjIiwiZmlsdGVyZWRTdGFycyJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7OztBQUNBLElBQUlBLFlBQVksR0FBSSxVQUFRLFNBQUtBLFlBQWQsSUFBK0IsVUFBVUMsR0FBVixFQUFlO0FBQzdELE1BQUlBLEdBQUcsSUFBSUEsR0FBRyxDQUFDQyxVQUFmLEVBQTJCLE9BQU9ELEdBQVA7QUFDM0IsTUFBSUUsTUFBTSxHQUFHLEVBQWI7QUFDQSxNQUFJRixHQUFHLElBQUksSUFBWCxFQUFpQixLQUFLLElBQUlHLENBQVQsSUFBY0gsR0FBZDtBQUFtQixRQUFJSSxNQUFNLENBQUNDLGNBQVAsQ0FBc0JDLElBQXRCLENBQTJCTixH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R0FBbUJBLFFBQW5CIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2ltcG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0U3RhcikgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSByZXN1bHRba10gPSBtb2Rba107XHJcbiAgICByZXN1bHRbXCJkZWZhdWx0XCJdID0gbW9kO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBkYl8xID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCIuL2RiXCIpKTtcclxuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xyXG5jb25zdCBub2RlX2ZldGNoXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIm5vZGUtZmV0Y2hcIikpO1xyXG5jb25zdCBOMllPX0tFWSA9IHV0aWxzXzEuZ2V0RW52VmFyKCdOMllPX0tFWScpO1xyXG5jb25zdCBOMllPX0hPU1QgPSAnaHR0cHM6Ly93d3cubjJ5by5jb20vcmVzdC92MS9zYXRlbGxpdGUvYWJvdmUnO1xyXG5jb25zdCBOMllPX0FMVCA9IDA7XHJcbmNvbnN0IE4yWU9fREVHID0gNzA7XHJcbmNvbnN0IE4yWU9fQ0FURUdPUlkgPSAzMjtcclxuY29uc3QgVVJMID0gKGxhdGl0dWRlLCBsb25naXR1ZGUpID0+IGAke04yWU9fSE9TVH0vJHtsYXRpdHVkZX0vJHtsb25naXR1ZGV9LyR7TjJZT19BTFR9LyR7TjJZT19ERUd9LyR7TjJZT19DQVRFR09SWX0vJmFwaUtleT0ke04yWU9fS0VZfWA7XHJcbjtcclxuY29uc3Qgc2lkZXJhbFRpbWUgPSB7XHJcbiAgICBkZWx0YUo6IDg2NDAwMDAwLFxyXG4gICAgTDA6IDk5Ljk2Nzc5NDY4NyxcclxuICAgIEwxOiAzNjAuOTg1NjQ3MzY2Mjg2MDMsXHJcbiAgICBMMjogMC4wMDAwMDAyOTA3ODc5LFxyXG4gICAgY2FsY3VsYXRlKGxvbmdpdHVkZSkge1xyXG4gICAgICAgIGNvbnN0IHRpbWUgPSBuZXcgRGF0ZSgpLmdldERhdGUoKTtcclxuICAgICAgICByZXR1cm4gKHRoaXMuTDAgKyB0aGlzLkwxICogdGhpcy5kZWx0YUogKiB0aW1lICsgdGhpcy5MMiAqIE1hdGgucG93KHRoaXMuZGVsdGFKICogdGltZSwgMikgLSBsb25naXR1ZGUpICUgMzYwO1xyXG4gICAgfVxyXG59O1xyXG5hc3luYyBmdW5jdGlvbiBnZXRTYXRlbGxpdGVzKGxhdGl0dWRlLCBsb25naXR1ZGUpIHtcclxuICAgIGNvbnN0IG15U2lkZXJhbCA9IHNpZGVyYWxUaW1lLmNhbGN1bGF0ZShsb25naXR1ZGUpO1xyXG4gICAgY29uc3QgcmVxID0gYXdhaXQgbm9kZV9mZXRjaF8xLmRlZmF1bHQoVVJMKGxhdGl0dWRlLCBsb25naXR1ZGUpKTtcclxuICAgIGNvbnN0IHNhdGVsbGl0ZXMgPSBhd2FpdCByZXEuanNvbigpO1xyXG4gICAgcmV0dXJuIHNhdGVsbGl0ZXMuYWJvdmUubWFwKChzKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcmEgPSBzaWRlcmFsVGltZS5jYWxjdWxhdGUocy5zYXRsbmcpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIC4uLnMsXHJcbiAgICAgICAgICAgIGNhbnZhc1Bvc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICB4OiByYSAtIG15U2lkZXJhbCxcclxuICAgICAgICAgICAgICAgIHk6IHMuc2F0bGF0IC0gbGF0aXR1ZGVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxufVxyXG5leHBvcnRzLmdldFNhdGVsbGl0ZXMgPSBnZXRTYXRlbGxpdGVzO1xyXG5hc3luYyBmdW5jdGlvbiBnZXRTdGFycyhsYXRpdHVkZSwgbG9uZ2l0dWRlKSB7XHJcbiAgICBjb25zdCBteVNpZGVyYWwgPSBzaWRlcmFsVGltZS5jYWxjdWxhdGUobG9uZ2l0dWRlKTtcclxuICAgIGNvbnN0IGZpbHRlcmVkU3RhcnMgPSBhd2FpdCBkYl8xLmRlZmF1bHQuZXhlY1F1ZXJ5KGRiXzEuRnVuY3Rpb25zLmdldCwgJ3N0YXJzJywge1xyXG4gICAgICAgICR3aGVyZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHRoaXMucmEgLSBteVNpZGVyYWwsIDIpICsgTWF0aC5wb3codGhpcy5kZWMgLSBsYXRpdHVkZSwgMikpIDw9IDcwO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGZpbHRlcmVkU3RhcnMubWFwKChzKSA9PiAoe1xyXG4gICAgICAgIC4uLnMsXHJcbiAgICAgICAgY2FudmFzUG9zaXRpb246IHtcclxuICAgICAgICAgICAgeDogcy5yYSAtIG15U2lkZXJhbCxcclxuICAgICAgICAgICAgeTogcy5kZWMgLSBsYXRpdHVkZVxyXG4gICAgICAgIH1cclxuICAgIH0pKTtcclxufVxyXG5leHBvcnRzLmdldFN0YXJzID0gZ2V0U3RhcnM7XHJcbiJdfQ==