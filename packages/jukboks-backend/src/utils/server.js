const path = require('path');
const express = require('express');
const OpenApiValidator = require('express-openapi-validator');
const mongoose = require('mongoose');
const { UserController } = require("./controllers/UserController")

async function createServer() {
  mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });

  const app = express();
  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  const userCtrl = new UserController()

  // Parse json to req.body
  app.use(express.json());

  const spec = path.resolve(__dirname, '../openapi.yml');

  app.get('/spec', (req, res) => {
    res.sendFile(spec);
  });

  app.use(
    OpenApiValidator.middleware({
      apiSpec: spec,
      validateRequests: true,
      validateResponses: false,
    }),
  );

  // Error handler
  app.use((err, req, res, next) => {
    if ('status' in err) {
      res.status(err.status || 500);
    } else {
      res.status(500);
    }
    res.json({
      message: err.message,
    });
  });

  app.get('/ping', (req, res) => {
    res.send('OK');
  });

  app.post('/users', userCtrl.create);
  app.get('/users', userCtrl.show);

  return app;
}

module.exports = { createServer };
