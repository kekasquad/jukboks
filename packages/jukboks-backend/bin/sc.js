const { getMetadata } = require('../src/soundcloud');

(async () => {
  const meta = await getMetadata('https://soundcloud.com/fkatwigsupdates/vggapmashup');
  console.log(meta);
})();
