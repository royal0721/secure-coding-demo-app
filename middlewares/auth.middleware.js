require('dotenv').config();
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.verifyAccessToken = (req, res, next) => {
  const token = req.cookie[config.accessToken.cookieName];
  if (!token)
    return res.status(401).json({
      status: 'error',
      error: '未授權：未提供Token',
    });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({
      status: 'error',
      error: '未授權：Token無效',
    });
  }
};

exports.extractRefreshToken = (req, res, next) => {
  const token = req.cookies[config.refreshToken.cookieName]; // 提取 Refresh Token
  if (!token) {
    return res.status(403).json({
      status: 'error',
      error: '沒有提供Refresh Token',
    });
  }
  req.refreshToken = token; // 將 Refresh Token 附加到請求物件
  next();
};
