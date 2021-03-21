const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  MONGO_URI,
  isDevelopment,
};
