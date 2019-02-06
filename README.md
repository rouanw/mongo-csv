# mongo-csv

> CLI tool that runs your query against MongoDB and outputs the results to CSV.

[![npm version](https://badge.fury.io/js/mongo-csv.svg)](https://badge.fury.io/js/mongo-csv)
[![Build Status](https://travis-ci.org/rouanw/mongo-csv.svg?branch=master)](https://travis-ci.org/rouanw/mongo-csv)
![Dependency Status](https://david-dm.org/rouanw/mongo-csv.svg)
![Open Source Love](https://badges.frapsoft.com/os/mit/mit.svg?v=102)

Supports both `find` and `aggregate` queries.

## Usage

Provide a `config.json` file in the directory you'll run `mongo-csv`, with the following format:

```json
{
  "url": "mongodb://my-mongo-server-url",
  "databaseName": "my_db",
  "collection": "my_collection",
  "query": { "color": "purple" }
}
```

Then you can either run `mongo-csv` with `npx`:

```js
MONGO_USER=my_user MONGO_PASSWORD=secret npx mongo-csv
```

Or you can install `mongo-csv` globally:

```js
npm install -g mongo-csv
MONGO_USER=my_user MONGO_PASSWORD=secret mongo-csv
```

## Config

Option|Description|Default value
---|---|---
`databaseName`|Name of the database with your data|**required**
`collection`|Name of the collection with your data|**required**
`url`|URL of the Mongo server to which you're connecting|`mongodb://localhost:27017`
`method`|Method you want to call on the collection - `find` or `aggregate`|`find`
`query`|The query you'd like to run to filter the data returned|`{}` (all records)
`options`|Lets you specify any of the Mongo driver's [find](http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#find) or [aggregate](http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#aggregate) options. This is especially useful when running a `find` for specifying a `projection` to limit the number of columns returned, or a `limit`, to limit the number of rows.|`{}`
`outputFilePath`|Path to the file to which you want the results written|`./query_results.csv`
`authDb`|Specify the database against which to authenticate|Defaults to the value supplied for `databaseName`

## Performance tips

`mongo-csv` will read documents using a `cursor` to avoid reading them all at once, but here are some additional performance considerations:
- Write as specific a `query` as you can so you only get the data you really need
- Use the `projection` option to specify only the fields you really need, so Mongo doesn't need to work to get you the rest
- It's usually a good idea to have a database index in place to support your query, so it can run quickly
- Avoid reading huge amounts of data at your peak usage periods
- If your Mongo environment is a replica set, it's a good idea to point at one of your secondary servers to leave the primary server free to take care of new data being written
