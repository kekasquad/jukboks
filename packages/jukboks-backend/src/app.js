'use strict';
const { createServer } = require('./server.js');

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;

createServer().then((app) =>
  app.listen(port, host, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  }),
);
