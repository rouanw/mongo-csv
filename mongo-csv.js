#! /usr/bin/env node

const fs = require('fs');
const { MongoClient } = require('mongodb');
const { parse } = require('json2csv');
const config =require(`${process.cwd()}/config.json`);

const url = config.url || 'mongodb://localhost:27017';
const databaseName = config.databaseName;
const authDb = config.authDb || config.databaseName;
const collection = config.collection;
const outputFilePath = config.outputFilePath || './query_results.csv';

const query = config.query || {};
const options = config.options || {};

const mongoQuery = (query) => {
  const dateRegex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
  return JSON.parse(JSON.stringify(query), (key, value) => {
    if (typeof value === 'string' && dateRegex.test(value)) {
      return new Date(value);
    }
    return value;
  });
};

(async function() {
  const auth = (process.env.MONGO_USER || config.mongoUser)
    ? {
      auth: {
        user: process.env.MONGO_USER || config.mongoUser,
        password: process.env.MONGO_PASSWORD || config.mongoPassword,
      },
    }
    : {};

  const client = new MongoClient(url, {
    useNewUrlParser: true,
    authSource: authDb,
    ...auth,
  });

  try {
    await client.connect();
    const db = client.db(databaseName);
    const cursor = db.collection(collection).find(mongoQuery(query), options);
    const documents = [];
    while (await cursor.hasNext()) {
      const document = await cursor.next();
      documents.push(document);
    }
    if (documents.length === 0) {
      console.error('0 documents were found, aborting');
      process.exit(1);
    }
    fs.writeFileSync(outputFilePath, parse(documents));
  } catch (err) {
    console.log(err.stack);
  }

  client.close();
})();
