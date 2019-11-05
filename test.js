const MongoClient = require('mongodb').MongoClient;

const url = process.env.MONGODB_URI;
const dbName = 'kyllur';

console.log(url, dbName);


MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) throw err;
  const db = client.db(dbName);
  const col = db.collection('stars')
  console.log(col);

  const rat = col
    .find({
      $where: function () {
        return this.masa < 100;
      }
    })
    .toArray((err, docs) => {
      console.log(docs);

    });
});
