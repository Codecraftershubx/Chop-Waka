
/**
 * Generate a cache key based on request parameters
 * @param {Object} req - express request object
 * @param {String} prefix - Prefix for the cache key
 * @returns {String} - Cache key
 */

export const generateCacheKey = (req, prefix) => {
    const queryParam = req.query ? JSON.stringify(req.query) : '';
    return `${prefix}:${queryParam}`;
};

/**
 * Query data from cache
 * @param {Object} client - Cache client (e.g., Redis client)
 * @param {String} key - Cache key
 * @returns {Promise<Object|null>} - Cached data or null if not found
 */
export const queryCache = async (client, key) => {
    try {
        const data = await client.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(`Error querying cache for key ${key}:`, error);
        return null;
    }
};

/**
 * Get data from cache or add it if not found
 * @param {Object} client - Cache client (e.g., Redis client)
 * @param {String} key - Cache key
 * @param {Function} fetchData - Function to fetch data if not in cache
 * @param {Number} ttl - Time to live in seconds (default: 1 hour)
 * @returns {Promise<Object>} - Data from cache or newly fetched
 */
export const getOrSetCache = async (client, key, fetchData, ttl = 3600) => {
    try {
        // Try to get data from cache
        const cachedData = await queryCache(client, key);
        
        if (cachedData) {
            return cachedData;
        }
        
        // If not in cache, fetch new data
        const newData = await fetchData();
        
        // Store in cache
        await client.set(key, JSON.stringify(newData), 'EX', ttl);
        
        return newData;
    } catch (error) {
        console.error(`Error in getOrSetCache for key ${key}:`, error);
        // If cache fails, still try to get the data
        return fetchData();
    }
};
