import fs from 'fs';
import DB, { Functions } from './db';

fs.readFile('./data/estrellas.csv', 'utf8', (err: any, content: string) => {
  if (err) throw Error(err);

  const separator = ',';
  let data = content.trim().split('\n');

  const keys: string[] = data[0]
    .toLowerCase()
    .trim()
    .split(separator);

  const stars = data
    .slice(1)
    .map(s => {
      return s
        .trim()
        .split(separator)
        .reduce((o: any, s: any, i: number) => {
          o[keys[i]] = isNaN(s) || s === '' ? s : +s;
          return o;
        }, {});
    });

  (async () => {
    await DB.execQuery(Functions.createMany, 'stars', {}, { data: stars });
    console.log('Loading done');
  })();
});
