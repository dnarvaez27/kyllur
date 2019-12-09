"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

Object.defineProperty(exports, "__esModule", {
  value: true
});

var parseArg = function parseArg() {
  var rta = [];

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  args.forEach(function (a) {
    switch ((0, _typeof2["default"])(a)) {
      case 'string':
        rta.push("'".concat(a, "'"));
        break;

      case 'number':
        rta.push("".concat(a));
        break;

      case 'object':
        rta.push(JSON.stringify(a));
        break;

      case 'function':
        rta.push("".concat(a.name || '_lambda', "()"));
        break;

      default:
        rta.push("".concat((0, _typeof2["default"])(a), ": ").concat(a, "]"));
        break;
    }
  });
  return rta.join(', ');
};

exports.decorators = {
  log: function log(tag) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$logArguments = _ref.logArguments,
        logArguments = _ref$logArguments === void 0 ? true : _ref$logArguments,
        _ref$logResult = _ref.logResult,
        logResult = _ref$logResult === void 0 ? false : _ref$logResult,
        _ref$throws = _ref["throws"],
        _throws = _ref$throws === void 0 ? true : _ref$throws;

    return function (target, name, descriptor) {
      var original = descriptor.value;

      if (typeof original === 'function') {
        descriptor.value = function () {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          console.log("".concat(tag, ": Calling ").concat(name, "(").concat(logArguments ? parseArg.apply(void 0, args) : '...', ")"));

          try {
            var result = original.apply(this, args);

            if (logResult) {
              console.log("".concat(tag, ": Result: ").concat(result));
            }

            return result;
          } catch (e) {
            console.log("".concat(tag, ": Error on ").concat(name, "\n ").concat(e));

            if (_throws) {
              throw e;
            }
          }
        };
      }

      return descriptor;
    };
  },
  logAsync: function logAsync(tag) {
    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref2$logArguments = _ref2.logArguments,
        logArguments = _ref2$logArguments === void 0 ? true : _ref2$logArguments,
        _ref2$logResult = _ref2.logResult,
        logResult = _ref2$logResult === void 0 ? false : _ref2$logResult,
        _ref2$throws = _ref2["throws"],
        _throws2 = _ref2$throws === void 0 ? true : _ref2$throws,
        _ref2$isAsync = _ref2.isAsync,
        isAsync = _ref2$isAsync === void 0 ? false : _ref2$isAsync;

    return function (target, name, descriptor) {
      var original = descriptor.value;

      if (typeof original === 'function') {
        descriptor.value = function _callee() {
          var _len3,
              args,
              _key3,
              result,
              _args = arguments;

          return _regenerator["default"].async(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  for (_len3 = _args.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                    args[_key3] = _args[_key3];
                  }

                  console.log("".concat(tag, ": Calling ").concat(name, "(").concat(logArguments ? parseArg.apply(void 0, args) : '...', ")"));
                  _context.prev = 2;
                  result = undefined;
                  _context.next = 6;
                  return _regenerator["default"].awrap(original.apply(this, args));

                case 6:
                  result = _context.sent;

                  if (logResult) {
                    console.log("".concat(tag, ": Result: ").concat(result));
                  }

                  return _context.abrupt("return", result);

                case 11:
                  _context.prev = 11;
                  _context.t0 = _context["catch"](2);
                  console.log("".concat(tag, ": Error on ").concat(name, "\n ").concat(_context.t0));

                  if (!_throws2) {
                    _context.next = 16;
                    break;
                  }

                  throw _context.t0;

                case 16:
                case "end":
                  return _context.stop();
              }
            }
          }, null, this, [[2, 11]]);
        };
      }

      return descriptor;
    };
  },
  intercept: function intercept(_ref3) {
    var _ref3$before = _ref3.before,
        before = _ref3$before === void 0 ? undefined : _ref3$before,
        _ref3$after = _ref3.after,
        after = _ref3$after === void 0 ? undefined : _ref3$after,
        _ref3$isAsync = _ref3.isAsync,
        isAsync = _ref3$isAsync === void 0 ? false : _ref3$isAsync;
    return function (target, name, descriptor) {
      var original = descriptor.value;

      if (typeof original === 'function') {
        descriptor.value = function () {
          for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }

          if (before) {
            before(this, args);
          }

          var result = original.apply(this, args);

          if (after) {
            after(this);
          }

          return result;
        };
      }

      return descriptor;
    };
  },
  interceptAsync: function interceptAsync(_ref4) {
    var _ref4$before = _ref4.before,
        before = _ref4$before === void 0 ? undefined : _ref4$before,
        _ref4$after = _ref4.after,
        after = _ref4$after === void 0 ? undefined : _ref4$after,
        _ref4$isAsync = _ref4.isAsync,
        isAsync = _ref4$isAsync === void 0 ? false : _ref4$isAsync;
    return function (target, name, descriptor) {
      var original = descriptor.value;

      if (typeof original === 'function') {
        descriptor.value = function _callee2() {
          var _len5,
              args,
              _key5,
              result,
              _args2 = arguments;

          return _regenerator["default"].async(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  for (_len5 = _args2.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                    args[_key5] = _args2[_key5];
                  }

                  if (before) {
                    before(this, args);
                  }

                  _context2.next = 4;
                  return _regenerator["default"].awrap(original.apply(this, args));

                case 4:
                  result = _context2.sent;

                  if (after) {
                    after(this);
                  }

                  return _context2.abrupt("return", result);

                case 7:
                case "end":
                  return _context2.stop();
              }
            }
          }, null, this);
        };
      }

      return descriptor;
    };
  }
};

exports.doResolve = function (resolve) {
  return function (err, data) {
    if (err) throw err;
    resolve(data);
  };
};

exports.doTry = function (reject, fun) {
  try {
    fun();
  } catch (error) {
    reject(error);
  }
};

exports.callbackToPromise = function (real, call) {
  return new Promise(function (resolve, reject) {
    exports.doTry(reject, function () {
      return call(real(resolve));
    });
  });
};

exports.asyncIterate = function _callee3(cursor, cbk) {
  var actual;
  return _regenerator["default"].async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return _regenerator["default"].awrap(cursor.next());

        case 2:
          actual = _context3.sent;

        case 3:
          if (!actual) {
            _context3.next = 10;
            break;
          }

          cbk(actual);
          _context3.next = 7;
          return _regenerator["default"].awrap(cursor.next());

        case 7:
          actual = _context3.sent;
          _context3.next = 3;
          break;

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.getEnvVar = function (name) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var obtained = process.env[name];

  if (obtained) {
    return obtained;
  } else if (defaultValue !== undefined) {
    return defaultValue;
  }

  throw Error("Variable not found: ".concat(name));
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3RzL3V0aWxzL3V0aWxzLmpzIl0sIm5hbWVzIjpbIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZXhwb3J0cyIsInZhbHVlIiwicGFyc2VBcmciLCJydGEiLCJhcmdzIiwiZm9yRWFjaCIsImEiLCJwdXNoIiwiSlNPTiIsInN0cmluZ2lmeSIsIm5hbWUiLCJqb2luIiwiZGVjb3JhdG9ycyIsImxvZyIsInRhZyIsImxvZ0FyZ3VtZW50cyIsImxvZ1Jlc3VsdCIsInRocm93cyIsInRhcmdldCIsImRlc2NyaXB0b3IiLCJvcmlnaW5hbCIsImNvbnNvbGUiLCJyZXN1bHQiLCJhcHBseSIsImUiLCJsb2dBc3luYyIsImlzQXN5bmMiLCJ1bmRlZmluZWQiLCJpbnRlcmNlcHQiLCJiZWZvcmUiLCJhZnRlciIsImludGVyY2VwdEFzeW5jIiwiZG9SZXNvbHZlIiwicmVzb2x2ZSIsImVyciIsImRhdGEiLCJkb1RyeSIsInJlamVjdCIsImZ1biIsImVycm9yIiwiY2FsbGJhY2tUb1Byb21pc2UiLCJyZWFsIiwiY2FsbCIsIlByb21pc2UiLCJhc3luY0l0ZXJhdGUiLCJjdXJzb3IiLCJjYmsiLCJuZXh0IiwiYWN0dWFsIiwiZ2V0RW52VmFyIiwiZGVmYXVsdFZhbHVlIiwib2J0YWluZWQiLCJwcm9jZXNzIiwiZW52IiwiRXJyb3IiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQUNBQSxNQUFNLENBQUNDLGNBQVAsQ0FBc0JDLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUVDLEVBQUFBLEtBQUssRUFBRTtBQUFULENBQTdDOztBQUNBLElBQU1DLFFBQVEsR0FBRyxTQUFYQSxRQUFXLEdBQWE7QUFDMUIsTUFBSUMsR0FBRyxHQUFHLEVBQVY7O0FBRDBCLG9DQUFUQyxJQUFTO0FBQVRBLElBQUFBLElBQVM7QUFBQTs7QUFFMUJBLEVBQUFBLElBQUksQ0FBQ0MsT0FBTCxDQUFhLFVBQUNDLENBQUQsRUFBTztBQUNoQixxQ0FBZUEsQ0FBZjtBQUNJLFdBQUss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Q0FBQ0UsSUFBUCxFQURBOztBQUFBO0FBQ2ZDLFVBQUFBLE1BRGU7O0FBQUE7QUFBQSxlQUVaQSxNQUZZO0FBQUE7QUFBQTtBQUFBOztBQUdmRixVQUFBQSxHQUFHLENBQUNFLE1BQUQsQ0FBSDtBQUhlO0FBQUEsK0NBSUFILE1BQU0sQ0FBQ0UsSUFBUCxFQUpBOztBQUFBO0FBSWZDLFVBQUFBLE1BSmU7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBQXZCOztBQU9BaEQsT0FBTyxDQUFDaUQsU0FBUixHQUFvQixVQUFDdkMsSUFBRCxFQUFvQztBQUFBLE1BQTdCd0MsWUFBNkIsdUVBQWR2QixTQUFjO0FBQ3BELE1BQU13QixRQUFRLEdBQUdDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZM0MsSUFBWixDQUFqQjs7QUFDQSxNQUFJeUMsUUFBSixFQUFjO0FBQ1YsV0FBT0EsUUFBUDtBQUNILEdBRkQsTUFHSyxJQUFJRCxZQUFZLEtBQUt2QixTQUFyQixFQUFnQztBQUNqQyxXQUFPdUIsWUFBUDtBQUNIOztBQUNELFFBQU1JLEtBQUssK0JBQXdCNUMsSUFBeEIsRUFBWDtBQUNILENBVEQiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBwYXJzZUFyZyA9ICguLi5hcmdzKSA9PiB7XHJcbiAgICBsZXQgcnRhID0gW107XHJcbiAgICBhcmdzLmZvckVhY2goKGEpID0+IHtcclxuICAgICAgICBzd2l0Y2ggKHR5cGVvZiBhKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3N0cmluZyc6XHJcbiAgICAgICAgICAgICAgICBydGEucHVzaChgJyR7YX0nYCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcclxuICAgICAgICAgICAgICAgIHJ0YS5wdXNoKGAke2F9YCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnb2JqZWN0JzpcclxuICAgICAgICAgICAgICAgIHJ0YS5wdXNoKEpTT04uc3RyaW5naWZ5KGEpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdmdW5jdGlvbic6XHJcbiAgICAgICAgICAgICAgICBydGEucHVzaChgJHthLm5hbWUgfHwgJ19sYW1iZGEnfSgpYCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJ0YS5wdXNoKGAke3R5cGVvZiAoYSl9OiAke2F9XWApO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcnRhLmpvaW4oJywgJyk7XHJcbn07XHJcbmV4cG9ydHMuZGVjb3JhdG9ycyA9IHtcclxuICAgIGxvZyh0YWcsIHsgbG9nQXJndW1lbnRzID0gdHJ1ZSwgbG9nUmVzdWx0ID0gZmFsc2UsIHRocm93cyA9IHRydWUgfSA9IHt9KSB7XHJcbiAgICAgICAgcmV0dXJuICh0YXJnZXQsIG5hbWUsIGRlc2NyaXB0b3IpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWwgPSBkZXNjcmlwdG9yLnZhbHVlO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9yaWdpbmFsID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdG9yLnZhbHVlID0gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgJHt0YWd9OiBDYWxsaW5nICR7bmFtZX0oJHtsb2dBcmd1bWVudHMgPyBwYXJzZUFyZyguLi5hcmdzKSA6ICcuLi4nfSlgKTtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gb3JpZ2luYWwuYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsb2dSZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke3RhZ306IFJlc3VsdDogJHtyZXN1bHR9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCR7dGFnfTogRXJyb3Igb24gJHtuYW1lfVxcbiAke2V9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aHJvd3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBkZXNjcmlwdG9yO1xyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgbG9nQXN5bmModGFnLCB7IGxvZ0FyZ3VtZW50cyA9IHRydWUsIGxvZ1Jlc3VsdCA9IGZhbHNlLCB0aHJvd3MgPSB0cnVlLCBpc0FzeW5jID0gZmFsc2UgfSA9IHt9KSB7XHJcbiAgICAgICAgcmV0dXJuICh0YXJnZXQsIG5hbWUsIGRlc2NyaXB0b3IpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWwgPSBkZXNjcmlwdG9yLnZhbHVlO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9yaWdpbmFsID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdG9yLnZhbHVlID0gYXN5bmMgZnVuY3Rpb24gKC4uLmFyZ3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgJHt0YWd9OiBDYWxsaW5nICR7bmFtZX0oJHtsb2dBcmd1bWVudHMgPyBwYXJzZUFyZyguLi5hcmdzKSA6ICcuLi4nfSlgKTtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBhd2FpdCBvcmlnaW5hbC5hcHBseSh0aGlzLCBhcmdzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvZ1Jlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCR7dGFnfTogUmVzdWx0OiAke3Jlc3VsdH1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgJHt0YWd9OiBFcnJvciBvbiAke25hbWV9XFxuICR7ZX1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRocm93cykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3I7XHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcbiAgICBpbnRlcmNlcHQoeyBiZWZvcmUgPSB1bmRlZmluZWQsIGFmdGVyID0gdW5kZWZpbmVkLCBpc0FzeW5jID0gZmFsc2UgfSkge1xyXG4gICAgICAgIHJldHVybiAodGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsID0gZGVzY3JpcHRvci52YWx1ZTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcmlnaW5hbCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRvci52YWx1ZSA9IGZ1bmN0aW9uICguLi5hcmdzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJlZm9yZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiZWZvcmUodGhpcywgYXJncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IG9yaWdpbmFsLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhZnRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZnRlcih0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3I7XHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcbiAgICBpbnRlcmNlcHRBc3luYyh7IGJlZm9yZSA9IHVuZGVmaW5lZCwgYWZ0ZXIgPSB1bmRlZmluZWQsIGlzQXN5bmMgPSBmYWxzZSB9KSB7XHJcbiAgICAgICAgcmV0dXJuICh0YXJnZXQsIG5hbWUsIGRlc2NyaXB0b3IpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWwgPSBkZXNjcmlwdG9yLnZhbHVlO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9yaWdpbmFsID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdG9yLnZhbHVlID0gYXN5bmMgZnVuY3Rpb24gKC4uLmFyZ3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYmVmb3JlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJlZm9yZSh0aGlzLCBhcmdzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgb3JpZ2luYWwuYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFmdGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFmdGVyKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZGVzY3JpcHRvcjtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnRzLmRvUmVzb2x2ZSA9IChyZXNvbHZlKSA9PiB7XHJcbiAgICByZXR1cm4gKGVyciwgZGF0YSkgPT4ge1xyXG4gICAgICAgIGlmIChlcnIpXHJcbiAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgfTtcclxufTtcclxuZXhwb3J0cy5kb1RyeSA9IChyZWplY3QsIGZ1bikgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBmdW4oKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydHMuY2FsbGJhY2tUb1Byb21pc2UgPSAocmVhbCwgY2FsbCkgPT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBleHBvcnRzLmRvVHJ5KHJlamVjdCwgKCkgPT4gY2FsbChyZWFsKHJlc29sdmUpKSk7XHJcbiAgICB9KTtcclxufTtcclxuZXhwb3J0cy5hc3luY0l0ZXJhdGUgPSBhc3luYyAoY3Vyc29yLCBjYmspID0+IHtcclxuICAgIGxldCBhY3R1YWwgPSBhd2FpdCBjdXJzb3IubmV4dCgpO1xyXG4gICAgd2hpbGUgKGFjdHVhbCkge1xyXG4gICAgICAgIGNiayhhY3R1YWwpO1xyXG4gICAgICAgIGFjdHVhbCA9IGF3YWl0IGN1cnNvci5uZXh0KCk7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydHMuZ2V0RW52VmFyID0gKG5hbWUsIGRlZmF1bHRWYWx1ZSA9IHVuZGVmaW5lZCkgPT4ge1xyXG4gICAgY29uc3Qgb2J0YWluZWQgPSBwcm9jZXNzLmVudltuYW1lXTtcclxuICAgIGlmIChvYnRhaW5lZCkge1xyXG4gICAgICAgIHJldHVybiBvYnRhaW5lZDtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGRlZmF1bHRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcclxuICAgIH1cclxuICAgIHRocm93IEVycm9yKGBWYXJpYWJsZSBub3QgZm91bmQ6ICR7bmFtZX1gKTtcclxufTtcclxuIl19