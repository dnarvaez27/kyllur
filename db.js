const MongoClient = require('mongodb').MongoClient;

const url = process.env.MONGODB_URI;
const dbName = 'kyllur';


console.log('MDB:', url, dbName);


const doResolve = (resolve) => {
  return (err, docs) => {
    if (err) throw err;
    resolve(docs);
  };
};

const doTry = (reject, fun) => {
  try {
    fun();
  } catch (error) {
    reject(error);
  }
};

const getDBConnection = (cbk) => {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, doResolve(cbk));
};

const iterate = async (cursor, cbk) => {
  let actual = await cursor.next();
  while (actual) {
    cbk(actual);
    actual = await cursor.next();
  }
};

const functions = {
  get(resolve, reject, db, collection_name, query = {}, limit = 100, sort = {}) {
    doTry(reject, () => {
      db.collection(collection_name)
        .find(query)
        .sort(sort)
        .limit(limit)
        .toArray(doResolve(resolve));
    });
  },
  getOne(resolve, reject, db, collection_name, query) {
    doTry(reject, () => {
      db.collection(collection_name)
        .findOne(query, doResolve(resolve));
    });
  },
  createOne(resolve, reject, db, collection_name, obj) {
    doTry(reject, () => {
      db.collection(collection_name)
        .insertOne(obj, doResolve(resolve));
    });
  },
  createMany(resolve, reject, db, collection_name, arrs) {
    doTry(reject, () => {
      db.collection(collection_name)
        .insertMany(arrs, doResolve(resolve));
    });
  },
  deleteOne(resolve, reject, db, collection_name, query) {
    doTry(reject, () => {
      db.collection(collection_name)
        .deleteOne(query, doResolve(resolve));
    });
  },
  deleteMany(resolve, reject, db, collection_name, query) {
    doTry(reject, () => {
      db.collection(collection_name)
        .deleteMany(query, doResolve(resolve));
    });
  },
  updateOne(resolve, reject, db, collection_name, query, values) {
    doTry(reject, () => {
      db.collection(collection_name)
        .updateOne(query, values, doResolve(resolve));
    });
  },
  updateMany(resolve, reject, db, collection_name, query, values) {
    doTry(reject, () => {
      db.collection(collection_name)
        .updateMany(query, values, doResolve(resolve));
    });
  },
  join(resolve, reject, db, collection_name, aggregate) {
    doTry(reject, () => {
      db.collection(collection_name)
        .aggregate(aggregate)
        .toArray(doResolve(resolve));
    });
  }
};

const execQuery = async (func, collection_name, query, ...args) => {
  return new Promise((resolve, reject) => {
    doTry(reject, () => {
      getDBConnection(client => {
        func(resolve, reject, client.db(dbName), collection_name, query, ...args);
        // client.close();
      });
    });
  });
};

const getCollections = (onDone) => {
  getDBConnection(client => {
    const db = client.db(dbName);
    const colls = db.listCollections({}, { nameOnly: true });
    (async () => {
      let collections = [];
      await iterate(colls, (item) => {
        if (item.type === 'collection') {
          collections.push(item.name);
        }
      });
      onDone(collections);
    })();
  });
};

const listenToChanges = (collectionName, pipeline = [], cbk, manipulateStream) => {
  getDBConnection(client => {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const changeStream = collection.watch(pipeline);
    console.log('MDB:', 'Listening to changes on mongo', collectionName, pipeline);

    changeStream.on('change', changedData => {
      console.log('MDB:', 'Data change', changedData.operationType);

      (async () => {
        const data = await execQuery(functions.get, collectionName, {});
        const dataRead = JSON.stringify(data);
        cbk(dataRead);
      })();
    });
    manipulateStream(changeStream);
  });
};

module.exports = {
  execQuery,
  functions,
  listenToChanges,
  getCollections
};
