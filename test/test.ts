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

interface LogOptions {
  logArguments?: boolean;
  logResult?: boolean;
  throws?: boolean;
}

interface InterceptListeners {
  before?: (object: any, args: any) => any;
  after?: (object: any) => any;
}

const decorators = {
  log(tag: string, { logArguments = true, logResult = false, throws = true }: LogOptions = {}) {
    return (target: any, name: string, descriptor: PropertyDescriptor) => {
      const original = descriptor.value;

      if (typeof original === 'function') {
        descriptor.value = function (...args: any) {
          console.log(`${tag}: Calling ${name}(${logArguments ? parseArg(...args) : '...'})`);
          try {
            const result = original.apply(this, args)
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
  intercept({ before = undefined, after = undefined }: InterceptListeners) {
    return (target: any, name: string, descriptor: PropertyDescriptor) => {
      const original = descriptor.value;

      if (typeof original === 'function') {
        descriptor.value = function (...args: any) {
          if (before) {
            before(this, args);
          }
          original.apply(this, args);
          if (after) {
            after(this);
          }
        }
      }
      return descriptor;
    }
  }
}


class Person {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  @decorators.log('PERSON')
  @decorators.intercept({ before: (obj,args) => console.log(`My name was ${obj.name} and will be changed to ${args[0]}. ${JSON.stringify(args)}`), after: obj => console.log(`Now is ${obj.name}`) })
  setName(name: string, i: number) {
    this.name = name;
  }
}

new Person('David').setName('Dog', 1);
