import NodeCache from "node-cache";

//create cache
export const cache = new NodeCache({
  stdTTL: 600, //10 minutes
  checkperiod: 620, //check for expired keys every 620 seconds
  useClones: false, //better performance
});

export const cacheMiddleware =
  (key, ttl = 600) =>
  async (req, res, next) => {
    //create a unique key based our api routes and query parameters
    const cacheKey = `${key}_${req.originalUrl}_${JSON.stringify(req.query)}`;
    try {
      const cachedData = cache.get(cacheKey); //retrive our key/saved data
      if (cachedData) {
        console.log(`Cache key for: ${cacheKey}`);
        return res.json(cachedData); //sending saved response back to the client
      }

      //try to save response
      const originalJSON = res.json;
      //overide res.json method to cache the response
      res.json = function (data) {
        //cache the response data
        cache.set(cacheKey, data, ttl);
        console.log(`Cache set for key: ${cacheKey}`);
        //call the orignal json method
        return originalJSON.call(this, data);
      };
      next();
    } catch (error) {
      console.error("Cache error", error);
      next();
    }
  };

export const clearCache = (pattern = null, clearAll = false) => {
  const keys = cache.keys();
  //this clears all cached data from node memory
  if (clearAll) {
    keys.forEach((key) => cache.del(key));
    console.log(`Cleared all cache entries`);
    return;
  }
  //this will clear cached data based on matched keys
  const matchingKeys = pattern
    ? keys.filter((key) => key.includes(pattern))
    : keys;
  //delete matched keys
  matchingKeys.forEach((key) => cache.del(key));
  console.log(`Cleared ${matchingKeys.length} cache entries`);
};
