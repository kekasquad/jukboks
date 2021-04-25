const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { MONGO_URI } = require('../config');
const { User } = require('../src/models/User');
const { Stream, calculateTimes } = require('../src/models/Stream');

(async () => {
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useUnifiedTopology', true);
  await mongoose.connect(MONGO_URI);

  const user = await User.findOneAndUpdate(
    {},
    {
      name: 'Test',
      username: 'test',
      password: bcrypt.hashSync('test', 12),
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );
  await user.save();

  const stream = new Stream({
    title: 'Test streams',
    author: user._id,
    songs: [
      {
        title: 'Zero song',
        artist: 'Test artist',
        url: 'https://soundcloud.com/test/test',
        duration: 5
      },
      {
        title: 'First song',
        artist: 'Test artist',
        url: 'https://soundcloud.com/test/test',
        duration: 10
      },
      {
        title: 'Second song',
        artist: 'Test artist',
        url: 'https://soundcloud.com/test/test',
        duration: 10,
      },
    ],
    dt_start: Date.now() + 10 * 1000,
  });
  calculateTimes(stream);
  await stream.save();
  user.streams.push(stream._id);
  await user.save();

  console.log(stream.uuid);
  console.log('done');
  process.exit();
})();
