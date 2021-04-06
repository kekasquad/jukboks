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

  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useUnifiedTopology', true);

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
