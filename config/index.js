module.exports = {
  server: {
    port: process.env.PORT || 3000,
  },
  csrf: {
    secret: process.env.CSRF_SECRET || 'default-secret',
    cookieName: 'csrf-token',
    cookieOptions: {
      sameSite: 'Strict',
      secure: process.env.COOKIE_SECURE,
      signed: true,
    },
  },
  cookieSecret: process.env.COOKIE_SECRET || 'default-cookie-secret',
};
