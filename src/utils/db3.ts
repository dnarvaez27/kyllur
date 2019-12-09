import { MongoClient, Db, FilterQuery, CommandCursor, CommandCursorResult, ChangeStream, Collection } from 'mongodb';
import { getEnvVar } from './utils';

const url = getEnvVar('MONGODB_URI');
const dbName = 'kyllur';

console.log('MDB:', url, dbName);


interface FunctionArguments {
  resolve: (data: any) => void,
  reject: (error: any) => void,
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
  onReady?: (stream: ChangeStream) => void;
}
type Function = (args: any) => void;


const doResolve = (resolve: (data: any) => void) => {
  return (err: any, data: any) => {
    if (err) throw err;
    resolve(data);
  };
};

const doTry = (reject: (error: any) => void, fun: () => void) => {
  try {
    fun();
  } catch (error) {
    reject(error);
  }
};

const getDBConnection = (cbk: (data: any) => void) => {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, doResolve(cbk));
};

const iterate = async (cursor: CommandCursor, cbk: (data: any) => void) => {
  let actual = await cursor.next();
  while (actual) {
    cbk(actual);
    actual = await cursor.next();
  }
};

export const functions: { [key: string]: Function } = {
  get({ resolve, reject, db, collection_name, query, args = { limit: 10000, sort: {} } }: FunctionGetArguments) {
    doTry(reject, () => {
      db.collection(collection_name)
        .find(query)
        .sort(args.sort)
        .limit(args.limit)
        .toArray(doResolve(resolve));
    });
  },
  getOne({ resolve, reject, db, collection_name, query }: FunctionArguments) {
    doTry(reject, () => {
      db.collection(collection_name)
        .findOne(query, doResolve(resolve));
    });
  },
  createOne({ resolve, reject, db, collection_name, args: { data } }: FunctionCreateArguments) {
    doTry(reject, () => {
      db.collection(collection_name)
        .insertOne(data, doResolve(resolve));
    });
  },
  createMany({ resolve, reject, db, collection_name, args: { data } }: FunctionCreateArguments) {
    doTry(reject, () => {
      db.collection(collection_name)
        .insertMany(data, doResolve(resolve));
    });
  },
  deleteOne({ resolve, reject, db, collection_name, query }: FunctionArguments) {
    doTry(reject, () => {
      db.collection(collection_name)
        .deleteOne(query, doResolve(resolve));
    });
  },
  deleteMany({ resolve, reject, db, collection_name, query }: FunctionArguments) {
    doTry(reject, () => {
      db.collection(collection_name)
        .deleteMany(query, doResolve(resolve));
    });
  },
  updateOne({ resolve, reject, db, collection_name, query, args: { values } }: FunctionUpdateArguments) {
    doTry(reject, () => {
      db.collection(collection_name)
        .updateOne(query, values, doResolve(resolve));
    });
  },
  updateMany({ resolve, reject, db, collection_name, query, args: { values } }: FunctionUpdateArguments) {
    doTry(reject, () => {
      db.collection(collection_name)
        .updateMany(query, values, doResolve(resolve));
    });
  },
  join({ resolve, reject, db, collection_name, args: { aggregate } }: FunctionJoinArguments) {
    doTry(reject, () => {
      db.collection(collection_name)
        .aggregate(aggregate)
        .toArray(doResolve(resolve));
    });
  }
};

export async function execQuery<T>(func: Function, collection_name: string, query: FilterQuery<any>, args: any = {}): Promise<T> {
  return new Promise((resolve, reject) => {
    doTry(reject, () => {
      getDBConnection(client => {
        func({ resolve, reject, db: client.db(dbName), collection_name, query, ...args });
      });
    });
  });
};

export const getCollections = (onDone: (colls: string[]) => void) => {
  getDBConnection(client => {
    const db = client.db(dbName);
    const colls: CommandCursor = db.listCollections({}, { nameOnly: true });
    (async () => {
      let collections: string[] = [];
      await iterate(colls, (item: any) => {
        if (item) {
          if (item.type === 'collection') {
            collections.push(item.name);
          }
        }
      });
      onDone(collections);
    })();
  });
};

export const listenToChanges = ({ collectionName, pipeline = [], onChange, onReady = () => { } }: ListenArguments) => {
  getDBConnection(client => {
    const db: Db = client.db(dbName);
    const collection: Collection<any> = db.collection(collectionName);

    const stream: ChangeStream = collection.watch(pipeline);
    console.log('MDB:', 'Listening to changes on mongo', collectionName, pipeline);

    stream.on('change', (changedData: any) => {
      console.log('MDB:', 'Data change', changedData.operationType);

      (async () => {
        const data = await execQuery(functions.get, collectionName, {});
        onChange(data);
      })();
    });
    onReady(stream);
  });
};
