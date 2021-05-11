const { AuthorizationCode } = require('simple-oauth2');
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_SCOPE, PUBLIC_URL } = require('../../config');

const CALLBACK_PATH = '/auth/github/callback';
const REDIRECT_URI = PUBLIC_URL + CALLBACK_PATH;

async function routes(fastify, options) {
  this.client = new AuthorizationCode({
    client: {
      id: GITHUB_CLIENT_ID,
      secret: GITHUB_CLIENT_SECRET,
    },
    auth: {
      tokenHost: 'https://github.com',
      tokenPath: '/login/oauth/access_token',
      authorizePath: '/login/oauth/authorize',
    },
  });

  fastify.get('/auth/github', async (request, reply) => {
    const authorizationUrl = client.authorizeURL({
      redirect_uri: REDIRECT_URI,
      scope: GITHUB_SCOPE,
    });
    reply.redirect(authorizationUrl);
  });

  fastify.post(CALLBACK_PATH, async (request, reply) => {
    const { code } = request.query;
    const options = {
      code,
    };

    const accessToken = await client.getToken(options);
    reply.send(accessToken.token);
    reply.redirect(`${PUBLIC_URL}/login/token?token=${accessToken.token}`);
  });
}

module.exports = routes;
