const { doubleCsrf } = require('csrf-csrf');
const config = require('../config');

const { generateToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: (req) => req.secret,
  secret: config.csrf.secret,
  cookieName: config.csrf.cookieName,
  cookieOptions: config.csrf.cookieOptions,
  size: 128,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  getTokenFromRequest: (req) => req.headers['x-csrf-token'],
});

module.exports = { generateToken, doubleCsrfProtection };
