module.exports = {
  server: {
    port: process.env.PORT || 3000,
  },
  csrf: {
    secret: process.env.CSRF_SECRET || 'default-secret',
    cookieName: 'csrfToken',
    cookieOptions: {
      sameSite: 'Strict',
      secure: true,
      signed: true,
    },
  },
  accessToken: {
    cookieName: 'accessToken',
    cookieOptions: {
      sameSite: 'Strict',
      secure: true,
      signed: true,
      maxAge: 15 * 60 * 1000, // Access Token 有效期 15 分鐘
    },
  },
  refreshToken: {
    cookieName: 'refreshToken',
    cookieOptions: {
      sameSite: 'Strict',
      secure: true,
      signed: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  },
  cookieSecret: process.env.COOKIE_SECRET || 'default-cookie-secret',
};
