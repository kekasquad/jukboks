const got = require('got');
const cheerio = require('cheerio');
const { parse, toSeconds } = require('iso8601-duration');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36';

const client = got.extend({
  headers: {
    'User-Agent': UA,
  },
});

/**
 * Parse `http://schema.org/MusicRecording` element
 * @param {cheerio.Cheerio} root
 * @returns Object
 */
function parseMusicRecording(root) {
  const props = {};
  root.find('[itemprop][content]').each(function (idx, el) {
    props[el.attribs['itemprop']] = el.attribs['content'];
  });
  return props;
}

/**
 * Get denormalized metadata
 * @param {string} url
 * @returns Object
 */
async function getDenormalizedData(url) {
  const resp = await client.get(url);
  const $ = cheerio.load(resp.body, { scriptingEnabled: false });

  const meta = {};
  for (const node of $('meta')) {
    if ('property' in node.attribs) {
      meta[node.attribs['property']] = node.attribs['content'];
    }
  }

  const musicRecordingRoot = $('noscript').find('article[itemtype="http://schema.org/MusicRecording"]');
  Object.assign(meta, parseMusicRecording(musicRecordingRoot));

  return meta;
}

function normalizeMetadata(meta) {
  const normalized = {};

  const set = (key, f = (_) => _) => (s) => (normalized[key] = f(s));

  const apply = {
    'og:title': set('title'),
    'og:url': set('url'),
    duration: set('duration', (s) => toSeconds(parse(s)) * 1000),
    'soundcloud:user': set('artist', (s) => s.split('/').pop()),
  };

  for (const [key, value] of Object.entries(meta)) {
    if (key in apply) {
      apply[key](value);
    }
  }

  return normalized;
}

/**
 * Get Track metadata
 * @param {string} url
 * @returns Object
 */
async function getMetadata(url) {
  let meta = await getDenormalizedData(url);
  meta = normalizeMetadata(meta);
  return meta;
}

module.exports = { getMetadata };
