const MongoClient = require("mongodb").MongoClient;

// const my = new MyMongoLib();
// const my = MyMongoLib();

const MyMongoLib = function() {
  const MyMongoLib = this || {};

  // Connection URL
  const url = process.env.MONGO_URL || "mongodb://localhost:27017";
  // Database Name
  const dbName = "reactive";
  // Create a new MongoClient
  const client = new MongoClient(url, { useUnifiedTopology: true });

  MyMongoLib.getDocs = () =>
    new Promise((resolve, reject) => {
      // Use connect method to connect to the Server
      client.connect((err, client) => {
        if (err !== null) {
          reject(err);
          return;
        }
        console.log("Connected correctly to server");
        const db = client.db(dbName);
        const testCol = db.collection("test");

        return testCol
          .find({})
          .limit(20)
          .toArray()
          .then(resolve)
          .catch(reject);
      });
    });

  MyMongoLib.listenToChanges = cbk => {
    client.connect((err, client) => {
      if (err !== null) {
        throw err;
      }
      console.log("Connected correctly to server");
      const db = client.db(dbName);
      const testCol = db.collection("test");

      const csCursor = testCol.watch();

      console.log("Listening to changes on mongo");
      csCursor.on("change", data => {
        console.log("changed!", data);

        MyMongoLib.getDocs().then(docs => cbk(JSON.stringify(docs)));
      });
    });
  };

  return MyMongoLib;
};

module.exports = MyMongoLib;
