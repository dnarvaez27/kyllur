import { MongoClient, Db, FilterQuery, CommandCursor, ChangeStream, Collection, CommandCursorResult, InsertOneWriteOpResult, DeleteWriteOpResultObject, UpdateWriteOpResult, MongoError, InsertWriteOpResult } from 'mongodb';
import { asyncIterate } from './utils';
import { getEnvVar, decorators } from './utils';

const url = getEnvVar('MONGODB_URI');
const dbName = 'kyllur';

console.log('MDB:', url, dbName);

interface FunctionArguments {
  db: Db,
  collection_name: string,
  query: FilterQuery<any>
}
interface FunctionGetArguments extends FunctionArguments {
  args: {
    limit: number;
    sort: any
  }
};
interface FunctionCreateArguments extends FunctionArguments {
  args: {
    data: any;
  }
}
interface FunctionUpdateArguments extends FunctionArguments {
  args: {
    values: any;
  }
}
interface FunctionJoinArguments extends FunctionArguments {
  args: {
    aggregate: any;
  }
}
interface ListenArguments {
  collectionName: string;
  pipeline: object[];
  onChange: (data: any) => void;
  onReady?: (stream: DBStream) => void;
}
type Function<T> = (args: any) => Promise<T>;


export class Functions {

  @decorators.interceptAsync({ before: (_, args: any[]) => console.log(`FUN: GET(${args[0].collection_name}: ${JSON.stringify(args[0].query)})`) })
  static async get<T>({ db, collection_name, query, args = { limit: 10000, sort: {} } }: FunctionGetArguments): Promise<T[]> {
    return await (
      db.collection<T>(collection_name)
        .find(query)
        .sort(args.sort)
        .limit(args.limit)
        .toArray()
    );
  }

  @decorators.interceptAsync({ before: (_, args: any[]) => console.log(`FUN: GET_ONE(${args[0].query})`) })
  static async getOne<T>({ db, collection_name, query }: FunctionArguments): Promise<T | null> {
    return await (
      db.collection<T>(collection_name)
        .findOne(query)
    );
  }

  @decorators.interceptAsync({ before: (_, args: any[]) => console.log(`FUN: CREATE_ONE(${args[0].args})`) })
  static async createOne<T>({ db, collection_name, args: { data } }: FunctionCreateArguments): Promise<InsertOneWriteOpResult<any>> {
    return await (
      db.collection<T>(collection_name)
        .insertOne(data)
    );
  }

  @decorators.interceptAsync({ before: (_, args: any[]) => console.log(`FUN: CREATE_MANY(${args[0].args})`) })
  static async createMany<T>({ db, collection_name, args: { data } }: FunctionCreateArguments): Promise<InsertWriteOpResult<any>> {
    return await (
      db.collection<T>(collection_name)
        .insertMany(data)
    );
  }

  @decorators.interceptAsync({ before: (_, args: any[]) => console.log(`FUN: DELETE_ONE(${args[0].query})`) })
  static async deleteOne<T>({ db, collection_name, query }: FunctionArguments): Promise<DeleteWriteOpResultObject> {
    return await (db.collection<T>(collection_name)
      .deleteOne(query)
    );
  }

  @decorators.interceptAsync({ before: (_, args: any[]) => console.log(`FUN: DELETE_MANY(${args[0].query})`) })
  static async deleteMany<T>({ db, collection_name, query }: FunctionArguments): Promise<DeleteWriteOpResultObject> {
    return await (
      db.collection<T>(collection_name)
        .deleteMany(query)
    );
  }

  @decorators.interceptAsync({ before: (_, args: any[]) => console.log(`FUN: UPDATE_ONE(${args[0].query})`) })
  static async updateOne<T>({ db, collection_name, query, args: { values } }: FunctionUpdateArguments): Promise<UpdateWriteOpResult> {
    return await (
      db.collection<T>(collection_name)
        .updateOne(query, values)
    );
  }

  @decorators.interceptAsync({ before: (_, args: any[]) => console.log(`FUN: UPDATE_MANY(${args[0].query})`) })
  static async updateMany<T>({ db, collection_name, query, args: { values } }: FunctionUpdateArguments): Promise<UpdateWriteOpResult> {
    return await (
      db.collection<T>(collection_name)
        .updateMany(query, values)
    );
  }

  @decorators.interceptAsync({ before: (_, args: any[]) => console.log(`FUN: JOIN(${args[0].args})`) })
  static async join<T>({ db, collection_name, args: { aggregate } }: FunctionJoinArguments): Promise<T[]> {
    return await (
      db.collection<T>(collection_name)
        .aggregate(aggregate)
        .toArray()
    );
  }
}

class DB {
  url: string;
  database: string;

  constructor(url: string, database: string) {
    this.url = url;
    this.database = database;
  }

  async getDBConnection(): Promise<MongoClient> {
    return MongoClient.connect(this.url, { useNewUrlParser: true, useUnifiedTopology: true });
  };

  async execQuery<T>(func: Function<T>, collection_name: string, query: FilterQuery<any>, args: any = {}): Promise<T> {
    const client = await this.getDBConnection();
    const response = await func({ db: client.db(this.database), collection_name, query, ...args });
    return response;
  };

  async getCollections(onDone: (colls: string[]) => void) {
    const client = await this.getDBConnection();
    const db = client.db(this.database);
    const colls: CommandCursor = db.listCollections({}, { nameOnly: true });

    let collections: string[] = [];
    await asyncIterate<CommandCursorResult>(colls, (item: CommandCursorResult | any) => {
      if (item) {
        if (item.type === 'collection') {
          collections.push(item.name);
        }
      }
    });
    onDone(collections);
  };

  async listenToChanges(collectionName: string, pipeline: object[] = []): Promise<DBStream> {
    const client = await this.getDBConnection();
    const db: Db = client.db(this.database);
    const collection: Collection<any> = db.collection(collectionName);
    const stream: ChangeStream = collection.watch(pipeline);

    const dbStream = new DBStream(stream, collectionName, async (collectionName) => {
      const data = await this.execQuery(Functions.get, collectionName, {});
      return data;
    });

    return dbStream;
  }
}

export class DBStream {
  stream: ChangeStream;
  collectionName: string;
  fetchData: (collection: string) => Promise<any>;
  dataChangedListener?: (data: any) => void;

  constructor(stream: ChangeStream, collectionName: string, fetchData: (collectionName: string) => Promise<any>) {
    this.collectionName = collectionName;
    this.stream = stream;
    this.stream.on('change', (changedData: any) => (async () => this.dataChanged(changedData))());

    this.fetchData = fetchData;
  }

  @decorators.intercept({ before: (obj: DBStream) => console.log(`DBS: Listening from data in ${obj.collectionName}`) })
  setOnDataChanged(dataChangedListener: (data: any) => void) {
    this.dataChangedListener = dataChangedListener;
  }

  @decorators.interceptAsync({ before: (obj: DBStream) => console.log(`DBS: Data changed in ${obj.collectionName}`) })
  async dataChanged(changedData: any) {
    const data = await this.fetchData(this.collectionName);
    if (this.dataChangedListener) {
      this.dataChangedListener(data);
    }
  }

  @decorators.intercept({ after: (obj: DBStream) => console.log(`DBS: Closed Stream ${obj.collectionName}`) })
  closeStream() {
    (async () => await this.stream.close())();
  }
}


const instance = new DB(url, dbName);
Object.freeze(instance);
export default instance;
