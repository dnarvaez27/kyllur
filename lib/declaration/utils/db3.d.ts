import { FilterQuery, ChangeStream } from 'mongodb';
interface ListenArguments {
    collectionName: string;
    pipeline: object[];
    onChange: (data: any) => void;
    onReady?: (stream: ChangeStream) => void;
}
declare type Function = (args: any) => void;
export declare const functions: {
    [key: string]: Function;
};
export declare function execQuery<T>(func: Function, collection_name: string, query: FilterQuery<any>, args?: any): Promise<T>;
export declare const getCollections: (onDone: (colls: string[]) => void) => void;
export declare const listenToChanges: ({ collectionName, pipeline, onChange, onReady }: ListenArguments) => void;
export {};
