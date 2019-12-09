import { MongoClient, Db, FilterQuery, ChangeStream, InsertOneWriteOpResult, DeleteWriteOpResultObject, UpdateWriteOpResult, InsertWriteOpResult } from 'mongodb';
interface FunctionArguments {
    db: Db;
    collection_name: string;
    query: FilterQuery<any>;
}
interface FunctionGetArguments extends FunctionArguments {
    args: {
        limit: number;
        sort: any;
    };
}
interface FunctionCreateArguments extends FunctionArguments {
    args: {
        data: any;
    };
}
interface FunctionUpdateArguments extends FunctionArguments {
    args: {
        values: any;
    };
}
interface FunctionJoinArguments extends FunctionArguments {
    args: {
        aggregate: any;
    };
}
declare type Function<T> = (args: any) => Promise<T>;
export declare class Functions {
    static get<T>({ db, collection_name, query, args }: FunctionGetArguments): Promise<T[]>;
    static getOne<T>({ db, collection_name, query }: FunctionArguments): Promise<T | null>;
    static createOne<T>({ db, collection_name, args: { data } }: FunctionCreateArguments): Promise<InsertOneWriteOpResult<any>>;
    static createMany<T>({ db, collection_name, args: { data } }: FunctionCreateArguments): Promise<InsertWriteOpResult<any>>;
    static deleteOne<T>({ db, collection_name, query }: FunctionArguments): Promise<DeleteWriteOpResultObject>;
    static deleteMany<T>({ db, collection_name, query }: FunctionArguments): Promise<DeleteWriteOpResultObject>;
    static updateOne<T>({ db, collection_name, query, args: { values } }: FunctionUpdateArguments): Promise<UpdateWriteOpResult>;
    static updateMany<T>({ db, collection_name, query, args: { values } }: FunctionUpdateArguments): Promise<UpdateWriteOpResult>;
    static join<T>({ db, collection_name, args: { aggregate } }: FunctionJoinArguments): Promise<T[]>;
}
declare class DB {
    url: string;
    database: string;
    constructor(url: string, database: string);
    getDBConnection(): Promise<MongoClient>;
    execQuery<T>(func: Function<T>, collection_name: string, query: FilterQuery<any>, args?: any): Promise<T>;
    getCollections(onDone: (colls: string[]) => void): Promise<void>;
    listenToChanges(collectionName: string, pipeline?: object[]): Promise<DBStream>;
}
export declare class DBStream {
    stream: ChangeStream;
    collectionName: string;
    fetchData: (collection: string) => Promise<any>;
    dataChangedListener?: (data: any) => void;
    constructor(stream: ChangeStream, collectionName: string, fetchData: (collectionName: string) => Promise<any>);
    setOnDataChanged(dataChangedListener: (data: any) => void): void;
    dataChanged(changedData: any): Promise<void>;
    closeStream(): void;
}
declare const instance: DB;
export default instance;
