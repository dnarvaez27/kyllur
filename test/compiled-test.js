"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _toArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

function _decorate(decorators, factory, superClass, mixins) { var api = _getDecoratorsApi(); if (mixins) { for (var i = 0; i < mixins.length; i++) { api = mixins[i](api); } } var r = factory(function initialize(O) { api.initializeInstanceElements(O, decorated.elements); }, superClass); var decorated = api.decorateClass(_coalesceClassElements(r.d.map(_createElementDescriptor)), decorators); api.initializeClassElements(r.F, decorated.elements); return api.runClassFinishers(r.F, decorated.finishers); }

function _getDecoratorsApi() { _getDecoratorsApi = function _getDecoratorsApi() { return api; }; var api = { elementsDefinitionOrder: [["method"], ["field"]], initializeInstanceElements: function initializeInstanceElements(O, elements) { ["method", "field"].forEach(function (kind) { elements.forEach(function (element) { if (element.kind === kind && element.placement === "own") { this.defineClassElement(O, element); } }, this); }, this); }, initializeClassElements: function initializeClassElements(F, elements) { var proto = F.prototype; ["method", "field"].forEach(function (kind) { elements.forEach(function (element) { var placement = element.placement; if (element.kind === kind && (placement === "static" || placement === "prototype")) { var receiver = placement === "static" ? F : proto; this.defineClassElement(receiver, element); } }, this); }, this); }, defineClassElement: function defineClassElement(receiver, element) { var descriptor = element.descriptor; if (element.kind === "field") { var initializer = element.initializer; descriptor = { enumerable: descriptor.enumerable, writable: descriptor.writable, configurable: descriptor.configurable, value: initializer === void 0 ? void 0 : initializer.call(receiver) }; } Object.defineProperty(receiver, element.key, descriptor); }, decorateClass: function decorateClass(elements, decorators) { var newElements = []; var finishers = []; var placements = { "static": [], prototype: [], own: [] }; elements.forEach(function (element) { this.addElementPlacement(element, placements); }, this); elements.forEach(function (element) { if (!_hasDecorators(element)) return newElements.push(element); var elementFinishersExtras = this.decorateElement(element, placements); newElements.push(elementFinishersExtras.element); newElements.push.apply(newElements, elementFinishersExtras.extras); finishers.push.apply(finishers, elementFinishersExtras.finishers); }, this); if (!decorators) { return { elements: newElements, finishers: finishers }; } var result = this.decorateConstructor(newElements, decorators); finishers.push.apply(finishers, result.finishers); result.finishers = finishers; return result; }, addElementPlacement: function addElementPlacement(element, placements, silent) { var keys = placements[element.placement]; if (!silent && keys.indexOf(element.key) !== -1) { throw new TypeError("Duplicated element (" + element.key + ")"); } keys.push(element.key); }, decorateElement: function decorateElement(element, placements) { var extras = []; var finishers = []; for (var decorators = element.decorators, i = decorators.length - 1; i >= 0; i--) { var keys = placements[element.placement]; keys.splice(keys.indexOf(element.key), 1); var elementObject = this.fromElementDescriptor(element); var elementFinisherExtras = this.toElementFinisherExtras((0, decorators[i])(elementObject) || elementObject); element = elementFinisherExtras.element; this.addElementPlacement(element, placements); if (elementFinisherExtras.finisher) { finishers.push(elementFinisherExtras.finisher); } var newExtras = elementFinisherExtras.extras; if (newExtras) { for (var j = 0; j < newExtras.length; j++) { this.addElementPlacement(newExtras[j], placements); } extras.push.apply(extras, newExtras); } } return { element: element, finishers: finishers, extras: extras }; }, decorateConstructor: function decorateConstructor(elements, decorators) { var finishers = []; for (var i = decorators.length - 1; i >= 0; i--) { var obj = this.fromClassDescriptor(elements); var elementsAndFinisher = this.toClassDescriptor((0, decorators[i])(obj) || obj); if (elementsAndFinisher.finisher !== undefined) { finishers.push(elementsAndFinisher.finisher); } if (elementsAndFinisher.elements !== undefined) { elements = elementsAndFinisher.elements; for (var j = 0; j < elements.length - 1; j++) { for (var k = j + 1; k < elements.length; k++) { if (elements[j].key === elements[k].key && elements[j].placement === elements[k].placement) { throw new TypeError("Duplicated element (" + elements[j].key + ")"); } } } } } return { elements: elements, finishers: finishers }; }, fromElementDescriptor: function fromElementDescriptor(element) { var obj = { kind: element.kind, key: element.key, placement: element.placement, descriptor: element.descriptor }; var desc = { value: "Descriptor", configurable: true }; Object.defineProperty(obj, Symbol.toStringTag, desc); if (element.kind === "field") obj.initializer = element.initializer; return obj; }, toElementDescriptors: function toElementDescriptors(elementObjects) { if (elementObjects === undefined) return; return (0, _toArray2["default"])(elementObjects).map(function (elementObject) { var element = this.toElementDescriptor(elementObject); this.disallowProperty(elementObject, "finisher", "An element descriptor"); this.disallowProperty(elementObject, "extras", "An element descriptor"); return element; }, this); }, toElementDescriptor: function toElementDescriptor(elementObject) { var kind = String(elementObject.kind); if (kind !== "method" && kind !== "field") { throw new TypeError('An element descriptor\'s .kind property must be either "method" or' + ' "field", but a decorator created an element descriptor with' + ' .kind "' + kind + '"'); } var key = _toPropertyKey(elementObject.key); var placement = String(elementObject.placement); if (placement !== "static" && placement !== "prototype" && placement !== "own") { throw new TypeError('An element descriptor\'s .placement property must be one of "static",' + ' "prototype" or "own", but a decorator created an element descriptor' + ' with .placement "' + placement + '"'); } var descriptor = elementObject.descriptor; this.disallowProperty(elementObject, "elements", "An element descriptor"); var element = { kind: kind, key: key, placement: placement, descriptor: Object.assign({}, descriptor) }; if (kind !== "field") { this.disallowProperty(elementObject, "initializer", "A method descriptor"); } else { this.disallowProperty(descriptor, "get", "The property descriptor of a field descriptor"); this.disallowProperty(descriptor, "set", "The property descriptor of a field descriptor"); this.disallowProperty(descriptor, "value", "The property descriptor of a field descriptor"); element.initializer = elementObject.initializer; } return element; }, toElementFinisherExtras: function toElementFinisherExtras(elementObject) { var element = this.toElementDescriptor(elementObject); var finisher = _optionalCallableProperty(elementObject, "finisher"); var extras = this.toElementDescriptors(elementObject.extras); return { element: element, finisher: finisher, extras: extras }; }, fromClassDescriptor: function fromClassDescriptor(elements) { var obj = { kind: "class", elements: elements.map(this.fromElementDescriptor, this) }; var desc = { value: "Descriptor", configurable: true }; Object.defineProperty(obj, Symbol.toStringTag, desc); return obj; }, toClassDescriptor: function toClassDescriptor(obj) { var kind = String(obj.kind); if (kind !== "class") { throw new TypeError('A class descriptor\'s .kind property must be "class", but a decorator' + ' created a class descriptor with .kind "' + kind + '"'); } this.disallowProperty(obj, "key", "A class descriptor"); this.disallowProperty(obj, "placement", "A class descriptor"); this.disallowProperty(obj, "descriptor", "A class descriptor"); this.disallowProperty(obj, "initializer", "A class descriptor"); this.disallowProperty(obj, "extras", "A class descriptor"); var finisher = _optionalCallableProperty(obj, "finisher"); var elements = this.toElementDescriptors(obj.elements); return { elements: elements, finisher: finisher }; }, runClassFinishers: function runClassFinishers(constructor, finishers) { for (var i = 0; i < finishers.length; i++) { var newConstructor = (0, finishers[i])(constructor); if (newConstructor !== undefined) { if (typeof newConstructor !== "function") { throw new TypeError("Finishers must return a constructor."); } constructor = newConstructor; } } return constructor; }, disallowProperty: function disallowProperty(obj, name, objectType) { if (obj[name] !== undefined) { throw new TypeError(objectType + " can't have a ." + name + " property."); } } }; return api; }

function _createElementDescriptor(def) { var key = _toPropertyKey(def.key); var descriptor; if (def.kind === "method") { descriptor = { value: def.value, writable: true, configurable: true, enumerable: false }; } else if (def.kind === "get") { descriptor = { get: def.value, configurable: true, enumerable: false }; } else if (def.kind === "set") { descriptor = { set: def.value, configurable: true, enumerable: false }; } else if (def.kind === "field") { descriptor = { configurable: true, writable: true, enumerable: true }; } var element = { kind: def.kind === "field" ? "field" : "method", key: key, placement: def["static"] ? "static" : def.kind === "field" ? "own" : "prototype", descriptor: descriptor }; if (def.decorators) element.decorators = def.decorators; if (def.kind === "field") element.initializer = def.value; return element; }

function _coalesceGetterSetter(element, other) { if (element.descriptor.get !== undefined) { other.descriptor.get = element.descriptor.get; } else { other.descriptor.set = element.descriptor.set; } }

function _coalesceClassElements(elements) { var newElements = []; var isSameElement = function isSameElement(other) { return other.kind === "method" && other.key === element.key && other.placement === element.placement; }; for (var i = 0; i < elements.length; i++) { var element = elements[i]; var other; if (element.kind === "method" && (other = newElements.find(isSameElement))) { if (_isDataDescriptor(element.descriptor) || _isDataDescriptor(other.descriptor)) { if (_hasDecorators(element) || _hasDecorators(other)) { throw new ReferenceError("Duplicated methods (" + element.key + ") can't be decorated."); } other.descriptor = element.descriptor; } else { if (_hasDecorators(element)) { if (_hasDecorators(other)) { throw new ReferenceError("Decorators can't be placed on different accessors with for " + "the same property (" + element.key + ")."); } other.decorators = element.decorators; } _coalesceGetterSetter(element, other); } } else { newElements.push(element); } } return newElements; }

function _hasDecorators(element) { return element.decorators && element.decorators.length; }

function _isDataDescriptor(desc) { return desc !== undefined && !(desc.value === undefined && desc.writable === undefined); }

function _optionalCallableProperty(obj, name) { var value = obj[name]; if (value !== undefined && typeof value !== "function") { throw new TypeError("Expected '" + name + "' to be a function"); } return value; }

function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return (0, _typeof2["default"])(key) === "symbol" ? key : String(key); }

function _toPrimitive(input, hint) { if ((0, _typeof2["default"])(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if ((0, _typeof2["default"])(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

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

var decorators = {
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
  intercept: function intercept(_ref2) {
    var _ref2$before = _ref2.before,
        before = _ref2$before === void 0 ? undefined : _ref2$before,
        _ref2$after = _ref2.after,
        after = _ref2$after === void 0 ? undefined : _ref2$after;
    return function (target, name, descriptor) {
      var original = descriptor.value;

      if (typeof original === 'function') {
        descriptor.value = function () {
          for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }

          if (before) {
            before(this, args);
          }

          original.apply(this, args);

          if (after) {
            after(this);
          }
        };
      }

      return descriptor;
    };
  }
};

var Person = _decorate(null, function (_initialize) {
  var Person = function Person(name) {
    (0, _classCallCheck2["default"])(this, Person);

    _initialize(this);

    this.name = name;
  };

  return {
    F: Person,
    d: [{
      kind: "field",
      key: "name",
      value: void 0
    }, {
      kind: "method",
      decorators: [decorators.log('PERSON'), decorators.intercept({
        before: function before(obj, args) {
          return console.log("My name was ".concat(obj.name, " and will be changed to ").concat(args[0], ". ").concat(JSON.stringify(args)));
        },
        after: function after(obj) {
          return console.log("Now is ".concat(obj.name));
        }
      })],
      key: "setName",
      value: function setName(name, i) {
        this.name = name;
      }
    }]
  };
});

new Person('David').setName('Dog', 1);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Li4uYXJnczogYW55KTogc3RyaW5nID0+IHtcclxuICBsZXQgcnRhOiBhbnkgPSBbXTtcclxuICBhcmdzLmZvckVhY2goKGE6IGFueSkgPT4ge1xyXG4gICAgc3dpdGNoICh0eXBlb2YgYSkge1xyXG4gICAgICBjYXNlICdzdHJpbmcnOlxyXG4gICAgICAgIHJ0YS5wdXNoKGAnJHthfSdgKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnbnVtYmVyJzpcclxuICAgICAgICBydGEucHVzaChgJHthfWApO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdvYmplY3QnOlxyXG4gICAgICAgIHJ0YS5wdXNoKEpTT04uc3RyaW5naWZ5KGEpKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnZnVuY3Rpb24nOlxyXG4gICAgICAgIHJ0YS5wdXNoKGAke2EubmFtZSB8fCAnX2xhbWJkYSd9KClgKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBydGEucHVzaChgJHt0eXBlb2YgKGEpfTogJHthfV1gKVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIHJldHVybiBydGEuam9pbignLCAnKTtcclxufVxyXG5cclxuaW50ZXJmYWNlIExvZ09wdGlvbnMge1xyXG4gIGxvZ0FyZ3VtZW50cz86IGJvb2xlYW47XHJcbiAgbG9nUmVzdWx0PzogYm9vbGVhbjtcclxuICB0aHJvd3M/OiBib29sZWFuO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgSW50ZXJjZXB0TGlzdGVuZXJzIHtcclxuICBiZWZvcmU/OiAob2JqZWN0OiBhbnksIGFyZ3M6IGFueSkgPT4gYW55O1xyXG4gIGFmdGVyPzogKG9iamVjdDogYW55KSA9PiBhbnk7XHJcbn1cclxuXHJcbmNvbnN0IGRlY29yYXRvcnMgPSB7XHJcbiAgbG9nKHRhZzogc3RyaW5nLCB7IGxvZ0FyZ3VtZW50cyA9IHRydWUsIGxvZ1Jlc3VsdCA9IGZhbHNlLCB0aHJvd3MgPSB0cnVlIH06IExvZ09wdGlvbnMgPSB7fSkge1xyXG4gICAgcmV0dXJuICh0YXJnZXQ6IGFueSwgbmFtZTogc3RyaW5nLCBkZXNjcmlwdG9yOiBQcm9wZXJ0eURlc2NyaXB0b3IpID0+IHtcclxuICAgICAgY29uc3Qgb3JpZ2luYWwgPSBkZXNjcmlwdG9yLnZhbHVlO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiBvcmlnaW5hbCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIGRlc2NyaXB0b3IudmFsdWUgPSBmdW5jdGlvbiAoLi4uYXJnczogYW55KSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhgJHt0YWd9OiBDYWxsaW5nICR7bmFtZX0oJHtsb2dBcmd1bWVudHMgPyBwYXJzZUFyZyguLi5hcmdzKSA6ICcuLi4nfSlgKTtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IG9yaWdpbmFsLmFwcGx5KHRoaXMsIGFyZ3MpXHJcbiAgICAgICAgICAgIGlmIChsb2dSZXN1bHQpIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgJHt0YWd9OiBSZXN1bHQ6ICR7cmVzdWx0fWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke3RhZ306IEVycm9yIG9uICR7bmFtZX1cXG4gJHtlfWApO1xyXG4gICAgICAgICAgICBpZiAodGhyb3dzKSB7XHJcbiAgICAgICAgICAgICAgdGhyb3cgZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZGVzY3JpcHRvcjtcclxuICAgIH1cclxuICB9LFxyXG4gIGludGVyY2VwdCh7IGJlZm9yZSA9IHVuZGVmaW5lZCwgYWZ0ZXIgPSB1bmRlZmluZWQgfTogSW50ZXJjZXB0TGlzdGVuZXJzKSB7XHJcbiAgICByZXR1cm4gKHRhcmdldDogYW55LCBuYW1lOiBzdHJpbmcsIGRlc2NyaXB0b3I6IFByb3BlcnR5RGVzY3JpcHRvcikgPT4ge1xyXG4gICAgICBjb25zdCBvcmlnaW5hbCA9IGRlc2NyaXB0b3IudmFsdWU7XHJcblxyXG4gICAgICBpZiAodHlwZW9mIG9yaWdpbmFsID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgZGVzY3JpcHRvci52YWx1ZSA9IGZ1bmN0aW9uICguLi5hcmdzOiBhbnkpIHtcclxuICAgICAgICAgIGlmIChiZWZvcmUpIHtcclxuICAgICAgICAgICAgYmVmb3JlKHRoaXMsIGFyZ3MpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgb3JpZ2luYWwuYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICAgICAgICBpZiAoYWZ0ZXIpIHtcclxuICAgICAgICAgICAgYWZ0ZXIodGhpcyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBkZXNjcmlwdG9yO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuXHJcbmNsYXNzIFBlcnNvbiB7XHJcbiAgbmFtZTogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcpIHtcclxuICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgfVxyXG5cclxuICBAZGVjb3JhdG9ycy5sb2coJ1BFUlNPTicpXHJcbiAgQGRlY29yYXRvcnMuaW50ZXJjZXB0KHsgYmVmb3JlOiAob2JqLGFyZ3MpID0+IGNvbnNvbGUubG9nKGBNeSBuYW1lIHdhcyAke29iai5uYW1lfSBhbmQgd2lsbCBiZSBjaGFuZ2VkIHRvICR7YXJnc1swXX0uICR7SlNPTi5zdHJpbmdpZnkoYXJncyl9YCksIGFmdGVyOiBvYmogPT4gY29uc29sZS5sb2coYE5vdyBpcyAke29iai5uYW1lfWApIH0pXHJcbiAgc2V0TmFtZShuYW1lOiBzdHJpbmcsIGk6IG51bWJlcikge1xyXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICB9XHJcbn1cclxuXHJcbm5ldyBQZXJzb24oJ0RhdmlkJykuc2V0TmFtZSgnRG9nJywgMSk7XHJcbiJdfQ==