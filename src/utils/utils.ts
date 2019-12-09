interface LogOptions {
  logArguments?: boolean;
  logResult?: boolean;
  throws?: boolean;
  onDone?: (target: any) => any;
  isAsync?: boolean;
}

interface InterceptListeners {
  before?: (object: any, args?: any) => any;
  after?: (object: any) => any;
  isAsync?: boolean;
}

interface AsyncIterable<T> {
  next: () => Promise<T>;
}

export type ErrorDataFunction<T, E> = (error: E, result: T) => void;
export type ExecuterOnCallback<T, E> = (toExecute: (data: T) => void) => ErrorDataFunction<T, E>;


const parseArg = (...args: any): string => {
  let rta: any = [];
  args.forEach((a: any) => {
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
        rta.push(`${typeof (a)}: ${a}]`)
        break;
    }
  });
  return rta.join(', ');
}

export const decorators = {
  log(tag: string, { logArguments = true, logResult = false, throws = true }: LogOptions = {}) {
    return (target: any, name: string, descriptor: PropertyDescriptor) => {
      const original = descriptor.value;

      if (typeof original === 'function') {
        descriptor.value = function (...args: any) {
          console.log(`${tag}: Calling ${name}(${logArguments ? parseArg(...args) : '...'})`);
          try {
            let result = original.apply(this, args)
            if (logResult) {
              console.log(`${tag}: Result: ${result}`);
            }
            return result;
          } catch (e) {
            console.log(`${tag}: Error on ${name}\n ${e}`);
            if (throws) {
              throw e;
            }
          }
        }
      }
      return descriptor;
    }
  },
  logAsync(tag: string, { logArguments = true, logResult = false, throws = true, isAsync = false }: LogOptions = {}) {
    return (target: any, name: string, descriptor: PropertyDescriptor) => {
      const original = descriptor.value;

      if (typeof original === 'function') {
        descriptor.value = async function (...args: any) {
          console.log(`${tag}: Calling ${name}(${logArguments ? parseArg(...args) : '...'})`);
          try {
            let result = undefined;
            result = await original.apply(this, args)
            if (logResult) {
              console.log(`${tag}: Result: ${result}`);
            }
            return result;
          } catch (e) {
            console.log(`${tag}: Error on ${name}\n ${e}`);
            if (throws) {
              throw e;
            }
          }
        }
      }
      return descriptor;
    }
  },
  intercept({ before = undefined, after = undefined, isAsync = false }: InterceptListeners) {
    return (target: any, name: string, descriptor: PropertyDescriptor) => {
      const original = descriptor.value;

      if (typeof original === 'function') {
        descriptor.value = function (...args: any) {
          if (before) {
            before(this, args);
          }
          const result = original.apply(this, args);
          if (after) {
            after(this);
          }
          return result;
        }
      }
      return descriptor;
    }
  },
  interceptAsync({ before = undefined, after = undefined, isAsync = false }: InterceptListeners) {
    return (target: any, name: string, descriptor: PropertyDescriptor) => {
      const original = descriptor.value;

      if (typeof original === 'function') {
        descriptor.value = async function (...args: any) {
          if (before) {
            before(this, args);
          }
          const result = await original.apply(this, args);
          if (after) {
            after(this);
          }
          return result;
        }
      }
      return descriptor;
    }
  }
}

export const doResolve = <T>(resolve: (data: T) => void) => {
  return (err: any, data: any) => {
    if (err) throw err;
    resolve(data);
  };
};

export const doTry = (reject: (error: any) => void, fun: () => void) => {
  try {
    fun();
  } catch (error) {
    reject(error);
  }
};

export const callbackToPromise = <T, E>(real: ExecuterOnCallback<T, E>, call: (cbkErrorData: ErrorDataFunction<T, E>) => void): Promise<T> => {
  return new Promise((resolve, reject) => {
    doTry(reject, () => call(real(resolve)));
  });
};

export const asyncIterate = async<T>(cursor: AsyncIterable<T>, cbk: (data: T) => void) => {
  let actual: T = await cursor.next();
  while (actual) {
    cbk(actual);
    actual = await cursor.next();
  }
};

export const getEnvVar = (name: string, defaultValue: any = undefined) => {
  const obtained = process.env[name];
  if (obtained) {
    return obtained;
  } else if (defaultValue !== undefined) {
    return defaultValue;
  }
  throw Error(`Variable not found: ${name}`);
};
