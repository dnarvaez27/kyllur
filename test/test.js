var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const parseArg = (...args) => {
    let rta = [];
    args.forEach((a) => {
        switch (typeof a) {
            case 'string':
                rta.push(`'${a}'`);
                break;
            case 'number':
                rta.push(`${a}`);
                break;
            case 'object':
                rta.push(JSON.stringify(a));
                break;
            case 'function':
                rta.push(`${a.name || '_lambda'}()`);
                break;
            default:
                rta.push(`${typeof (a)}: ${a}]`);
                break;
        }
    });
    return rta.join(', ');
};
const decorators = {
    log(tag, { logArguments = true, logResult = false, throws = true } = {}) {
        return (target, name, descriptor) => {
            const original = descriptor.value;
            if (typeof original === 'function') {
                descriptor.value = function (...args) {
                    console.log(`${tag}: Calling ${name}(${logArguments ? parseArg(...args) : '...'})`);
                    try {
                        const result = original.apply(this, args);
                        if (logResult) {
                            console.log(`${tag}: Result: ${result}`);
                        }
                        return result;
                    }
                    catch (e) {
                        console.log(`${tag}: Error on ${name}\n ${e}`);
                        if (throws) {
                            throw e;
                        }
                    }
                };
            }
            return descriptor;
        };
    },
    intercept({ before = undefined, after = undefined }) {
        return (target, name, descriptor) => {
            const original = descriptor.value;
            if (typeof original === 'function') {
                descriptor.value = function (...args) {
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
class Person {
    constructor(name) {
        this.name = name;
    }
    setName(name, i) {
        this.name = name;
    }
}
__decorate([
    decorators.log('PERSON'),
    decorators.intercept({ before: (obj, args) => console.log(`My name was ${obj.name} and will be changed to ${args[0]}. ${JSON.stringify(args)}`), after: obj => console.log(`Now is ${obj.name}`) })
], Person.prototype, "setName", null);
new Person('David').setName('Dog', 1);
