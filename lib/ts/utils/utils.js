"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.decorators = {
    log(tag, { logArguments = true, logResult = false, throws = true } = {}) {
        return (target, name, descriptor) => {
            const original = descriptor.value;
            if (typeof original === 'function') {
                descriptor.value = function (...args) {
                    console.log(`${tag}: Calling ${name}(${logArguments ? parseArg(...args) : '...'})`);
                    try {
                        let result = original.apply(this, args);
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
    logAsync(tag, { logArguments = true, logResult = false, throws = true, isAsync = false } = {}) {
        return (target, name, descriptor) => {
            const original = descriptor.value;
            if (typeof original === 'function') {
                descriptor.value = async function (...args) {
                    console.log(`${tag}: Calling ${name}(${logArguments ? parseArg(...args) : '...'})`);
                    try {
                        let result = undefined;
                        result = await original.apply(this, args);
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
    intercept({ before = undefined, after = undefined, isAsync = false }) {
        return (target, name, descriptor) => {
            const original = descriptor.value;
            if (typeof original === 'function') {
                descriptor.value = function (...args) {
                    if (before) {
                        before(this, args);
                    }
                    const result = original.apply(this, args);
                    if (after) {
                        after(this);
                    }
                    return result;
                };
            }
            return descriptor;
        };
    },
    interceptAsync({ before = undefined, after = undefined, isAsync = false }) {
        return (target, name, descriptor) => {
            const original = descriptor.value;
            if (typeof original === 'function') {
                descriptor.value = async function (...args) {
                    if (before) {
                        before(this, args);
                    }
                    const result = await original.apply(this, args);
                    if (after) {
                        after(this);
                    }
                    return result;
                };
            }
            return descriptor;
        };
    }
};
exports.doResolve = (resolve) => {
    return (err, data) => {
        if (err)
            throw err;
        resolve(data);
    };
};
exports.doTry = (reject, fun) => {
    try {
        fun();
    }
    catch (error) {
        reject(error);
    }
};
exports.callbackToPromise = (real, call) => {
    return new Promise((resolve, reject) => {
        exports.doTry(reject, () => call(real(resolve)));
    });
};
exports.asyncIterate = async (cursor, cbk) => {
    let actual = await cursor.next();
    while (actual) {
        cbk(actual);
        actual = await cursor.next();
    }
};
exports.getEnvVar = (name, defaultValue = undefined) => {
    const obtained = process.env[name];
    if (obtained) {
        return obtained;
    }
    else if (defaultValue !== undefined) {
        return defaultValue;
    }
    throw Error(`Variable not found: ${name}`);
};
