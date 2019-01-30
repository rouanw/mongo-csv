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
const projection = config.projection || {};

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
    const cursor = db.collection(collection).find(query, { projection });
    const users = [];
    while (await cursor.hasNext()) {
      const user = await cursor.next();
      users.push(user);
    }
    fs.writeFileSync(outputFilePath, parse(users));
  } catch (err) {
    console.log(err.stack);
  }

  client.close();
})();
