const test = require('tape');
const { ObjectID } = require('mongodb');
const mongoQuery = require('./lib/mongo-query');

test('mongoQuery converts ISO date strings to dates', (t) => {
  const query = { theDate: { $gte: '2018-12-31T00:00:00.000Z', $lte: '2019-01-30T00:00:00.000Z' } };
  const convertedQuery = mongoQuery(query);
  t.ok(convertedQuery.theDate.$gte.getMonth);
  t.ok(convertedQuery.theDate.$lte.getMonth);
  t.end();
});

test('mongoQuery converts _id fields to ObjectIDs', (t) => {
  const query = { _id: '5adff54537b87f441f9075bd'};
  const convertedQuery = mongoQuery(query);
  t.ok(convertedQuery._id instanceof ObjectID);
  t.end();
});
