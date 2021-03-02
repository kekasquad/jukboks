const { createServer } = require('./utils/server.js');

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;

createServer().then((app) =>
  app.listen(port, host, () => {
    console.log(`server started at http://localhost:${port}`);
  }),
);
