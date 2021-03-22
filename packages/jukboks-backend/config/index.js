const dotenv = require('dotenv');

dotenv();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';

const isDevelopment = process.env.NODE_ENV !== 'production';

const isProd = process.env.NODE_ENV === 'production';

let JWT_SECRET = process.env.JWT_SECRET;

if (isProd && !JWT_SECRET) {
  throw new Error('JWT_SECRET must be set in prod environment');
} else {
  JWT_SECRET = 'default';
}

module.exports = {
  MONGO_URI,
  isDevelopment,
  isProd,
  JWT_SECRET,
};
