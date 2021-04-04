const got = require('got');
const cheerio = require('cheerio');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36';

const client = got.extend({
  headers: {
    'User-Agent': UA,
  },
});

const parseMetadataByUrl = async (url) => {
  const resp = await client.get(url);
  const $ = cheerio.load(resp.body);

  const nodes = $('meta');
  const meta = {};
  for (const node of nodes) {
    if (!('property' in node.attribs)) continue;
    meta[node.attribs['property']] = node.attribs['content'];
  }
  return meta;
};

module.exports = { parseMetadataByUrl };
