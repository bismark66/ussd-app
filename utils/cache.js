const memoryCache = require("memory-cache");

const cache = {
  get: (key) => memoryCache.get(key),
  put: (key, value) => memoryCache.put(key, value),
};

module.exports = cache;
