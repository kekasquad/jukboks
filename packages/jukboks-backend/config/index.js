const isDevelopment = process.env.NODE_ENV !== 'production';

const { parsed } = require('dotenv').config();

if (isDevelopment) {
  console.log('Env loaded');
  console.log(parsed);
}

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';

const isProd = process.env.NODE_ENV === 'production';

let JWT_SECRET = process.env.JWT_SECRET;

if (isProd && !JWT_SECRET) {
  throw new Error('JWT_SECRET must be set in prod environment');
} else {
  JWT_SECRET = 'default';
}

// Public url of jukboks-frontend, needed for CORS, comma-delimited
PUBLIC_URL = process.env.PUBLIC_URL ? process.env.PUBLIC_URL.split(',') : ['http://localhost:3000'];
API_URL = process.env.API_URL ? process.env.API_URL.split(',') : ['http://localhost:8080'];

GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
GITHUB_SCOPE = 'read:user';

module.exports = {
  isDevelopment,
  isProd,
  JWT_SECRET,
  MONGO_URI,
  PUBLIC_URL,
  API_URL,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_SCOPE,
};
