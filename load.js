const fs = require('fs');
const db = require('./db');

fs.readFile('./stars.csv', 'utf8', (err, content) => {
  const separator = ';';
  let stars = content.trim().split('\n');

  const keys = stars[0]
    .toLowerCase()
    .trim()
    .split(separator);

  stars = stars
    .slice(1)
    .map(s => {
      return s
        .trim()
        .split(separator)
        .reduce((o, s, i) => {
          o[keys[i]] = isNaN(s) ? s : +s;
          return o;
        }, { likes: 0 });
    });

  (async () => {
    await db.execQuery(db.functions.createMany, 'stars', stars);
    console.log('Loading done');
  })();
});
