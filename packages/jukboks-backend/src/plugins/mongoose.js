const fp = require('fastify-plugin');
const mongoose = require('mongoose');

async function mongooseConnector(fastify, { uri, settings }, next) {
  settings = Object.assign(
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    settings,
  );
  await mongoose.connect(uri, settings);

  fastify.addHook('onClose', (app, done) => {
    app.mongoose.connection.on('close', function () {
      done();
    });
    app.mongoose.connection.close();
  });

  fastify.decorate('mongoose', mongoose);
  next();
}

module.exports = fp(mongooseConnector, {
  name: 'mongoose',
});
