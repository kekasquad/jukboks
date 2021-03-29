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

module.exports = {
  isDevelopment,
  isProd,
  JWT_SECRET,
  MONGO_URI,
};
