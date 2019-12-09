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
export declare type ErrorDataFunction<T, E> = (error: E, result: T) => void;
export declare type ExecuterOnCallback<T, E> = (toExecute: (data: T) => void) => ErrorDataFunction<T, E>;
export declare const decorators: {
    log(tag: string, { logArguments, logResult, throws }?: LogOptions): (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    logAsync(tag: string, { logArguments, logResult, throws, isAsync }?: LogOptions): (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    intercept({ before, after, isAsync }: InterceptListeners): (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    interceptAsync({ before, after, isAsync }: InterceptListeners): (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
};
export declare const doResolve: <T>(resolve: (data: T) => void) => (err: any, data: any) => void;
export declare const doTry: (reject: (error: any) => void, fun: () => void) => void;
export declare const callbackToPromise: <T, E>(real: ExecuterOnCallback<T, E>, call: (cbkErrorData: ErrorDataFunction<T, E>) => void) => Promise<T>;
export declare const asyncIterate: <T>(cursor: AsyncIterable<T>, cbk: (data: T) => void) => Promise<void>;
export declare const getEnvVar: (name: string, defaultValue?: any) => any;
export {};
