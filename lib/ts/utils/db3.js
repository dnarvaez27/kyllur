"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const utils_1 = require("./utils");
const url = utils_1.getEnvVar('MONGODB_URI');
const dbName = 'kyllur';
console.log('MDB:', url, dbName);
;
const doResolve = (resolve) => {
    return (err, data) => {
        if (err)
            throw err;
        resolve(data);
    };
};
const doTry = (reject, fun) => {
    try {
        fun();
    }
    catch (error) {
        reject(error);
    }
};
const getDBConnection = (cbk) => {
    mongodb_1.MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, doResolve(cbk));
};
const iterate = async (cursor, cbk) => {
    let actual = await cursor.next();
    while (actual) {
        cbk(actual);
        actual = await cursor.next();
    }
};
exports.functions = {
    get({ resolve, reject, db, collection_name, query, args = { limit: 10000, sort: {} } }) {
        doTry(reject, () => {
            db.collection(collection_name)
                .find(query)
                .sort(args.sort)
                .limit(args.limit)
                .toArray(doResolve(resolve));
        });
    },
    getOne({ resolve, reject, db, collection_name, query }) {
        doTry(reject, () => {
            db.collection(collection_name)
                .findOne(query, doResolve(resolve));
        });
    },
    createOne({ resolve, reject, db, collection_name, args: { data } }) {
        doTry(reject, () => {
            db.collection(collection_name)
                .insertOne(data, doResolve(resolve));
        });
    },
    createMany({ resolve, reject, db, collection_name, args: { data } }) {
        doTry(reject, () => {
            db.collection(collection_name)
                .insertMany(data, doResolve(resolve));
        });
    },
    deleteOne({ resolve, reject, db, collection_name, query }) {
        doTry(reject, () => {
            db.collection(collection_name)
                .deleteOne(query, doResolve(resolve));
        });
    },
    deleteMany({ resolve, reject, db, collection_name, query }) {
        doTry(reject, () => {
            db.collection(collection_name)
                .deleteMany(query, doResolve(resolve));
        });
    },
    updateOne({ resolve, reject, db, collection_name, query, args: { values } }) {
        doTry(reject, () => {
            db.collection(collection_name)
                .updateOne(query, values, doResolve(resolve));
        });
    },
    updateMany({ resolve, reject, db, collection_name, query, args: { values } }) {
        doTry(reject, () => {
            db.collection(collection_name)
                .updateMany(query, values, doResolve(resolve));
        });
    },
    join({ resolve, reject, db, collection_name, args: { aggregate } }) {
        doTry(reject, () => {
            db.collection(collection_name)
                .aggregate(aggregate)
                .toArray(doResolve(resolve));
        });
    }
};
async function execQuery(func, collection_name, query, args = {}) {
    return new Promise((resolve, reject) => {
        doTry(reject, () => {
            getDBConnection(client => {
                func({ resolve, reject, db: client.db(dbName), collection_name, query, ...args });
            });
        });
    });
}
exports.execQuery = execQuery;
;
exports.getCollections = (onDone) => {
    getDBConnection(client => {
        const db = client.db(dbName);
        const colls = db.listCollections({}, { nameOnly: true });
        (async () => {
            let collections = [];
            await iterate(colls, (item) => {
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
exports.listenToChanges = ({ collectionName, pipeline = [], onChange, onReady = () => { } }) => {
    getDBConnection(client => {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const stream = collection.watch(pipeline);
        console.log('MDB:', 'Listening to changes on mongo', collectionName, pipeline);
        stream.on('change', (changedData) => {
            console.log('MDB:', 'Data change', changedData.operationType);
            (async () => {
                const data = await execQuery(exports.functions.get, collectionName, {});
                onChange(data);
            })();
        });
        onReady(stream);
    });
};
