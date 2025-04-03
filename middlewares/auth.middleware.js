require("dotenv").config();
const jwt = require("jsonwebtoken");
const config = require("../config");
const logService = require("../services/log.service");

exports.verifyAccessToken = (req, res, next) => {
  const token = req.signedCookies[config.accessToken.cookieName];

  if (!token)
    return res.status(401).json({
      status: "error",
      message: "未授權：未提供Token",
    });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    logService.error(`JWT 驗證失敗：${err instanceof Error ? err.message : String(err)}`);
    return res.status(403).json({
      status: "error",
      message: "未授權：Token無效",
    });
  }
};

exports.extractRefreshToken = (req, res, next) => {
  const token = req.signedCookies[config.refreshToken.cookieName]; // 提取 Refresh Token
  if (!token) {
    return res.status(403).json({
      status: "error",
      message: "沒有提供Refresh Token",
    });
  }
  req.refreshToken = token; // 將 Refresh Token 附加到請求物件
  next();
};
