const { parseMetadataByUrl } = require('../src/soundcloud');

(async () => {
  const meta = await parseMetadataByUrl('https://soundcloud.com/fkatwigsupdates/vggapmashup');
  console.log(meta);
})();
