const test = require('tape');
const mongoQuery = require('./lib/mongo-query');

test('mongoQuery converts ISO date strings to dates', (t) => {
  const query = { theDate: { $gte: '2018-12-31T00:00:00.000Z', $lte: '2019-01-30T00:00:00.000Z' } };
  const mongoReady = mongoQuery(query);
  t.ok(mongoReady.theDate.$gte.getMonth);
  t.ok(mongoReady.theDate.$lte.getMonth);
  t.end();
});
