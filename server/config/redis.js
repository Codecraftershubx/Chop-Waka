import { createClient } from 'redis';
import logger from '../utils/logger.js';
import config from './index.js';

let client;

const connectRedis = async () => {
    if (client) {
        return client;
    }
    logger.info('Connecting to Redis Server');
    client = createClient();
    client.on('error', (error) => logger.error(`Redis client error: ${error.message}`));
    await client.connect();
    logger.info('Redis connected successfully');
    return client;
}

process.on('SIGINT', async () => {
    logger.info('Closing Redis connection...');
    await client.quit();
    process.exit(0);
});

export default connectRedis;
