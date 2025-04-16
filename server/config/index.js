import dotenv from 'dotenv';

// Load env vars
dotenv.config();


export default {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET || "qTYTE#@D++=Qop",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "qTYTE#@D++=Qop",
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',

  // Email settings
  EMAIL_USERNAME: process.env.EMAIL_USERNAME,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || 'Chop Waka Restaurant',
  EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS,
  EMAIL_USE_OAUTH: process.env.EMAIL_USE_OAUTH === 'true',
  
  // OAuth2 settings (if using OAuth)
  OAUTH_CLIENT_ID: process.env.OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET: process.env.OAUTH_CLIENT_SECRET,
  OAUTH_REFRESH_TOKEN: process.env.OAUTH_REFRESH_TOKEN,
  OAUTH_ACCESS_TOKEN: process.env.OAUTH_ACCESS_TOKEN
};