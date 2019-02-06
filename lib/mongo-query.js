const { ObjectID } = require('mongodb');

module.exports = (query) => {
  const dateRegex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
  return JSON.parse(JSON.stringify(query), (key, value) => {
    if (typeof value === 'string' && dateRegex.test(value)) {
      return new Date(value);
    }
    if (key === '_id' && typeof value === 'string') {
      return new ObjectID(value);
    }
    return value;
  });
};
