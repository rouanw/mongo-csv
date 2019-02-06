const allowedMethods = ['find', 'aggregate'];

module.exports = (method) => {
  if (allowedMethods.includes(method)) {
    return method;
  }
  throw new Error(`Unsupported method. Supported methods: ${allowedMethods.join(', ')}`);
}
