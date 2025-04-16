import { createClient } from 'redis';
import logger from '../utils/logger.js';
import config from './index.js';

const connectRedis = async () => {
    logger.info('Connecting to Redis Server');
    const client = createClient();
    client.on('error', (error) => logger.error(`Redis client error: ${error.message}`));
    await client.connect();
    logger.info('Redis connected successfully');
}

process.on('SIGINT', async () => {
    logger.info('CLosing Redis connection...');
    await connectRedis.quit();
    process.exit(0);
});

export default connectRedis;
