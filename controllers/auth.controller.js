const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logService = require('../services/log.service');
const { maskUsername } = require('../utils/maskUtils');
const config = require('../config');
const RefreshToken = require('../models/refreshToken');

exports.registerUser = async (req, res) => {
  const { username, password, roleId } = req.body;

  try {
    // 檢查用戶是否存在
    const existingUser = await User.findByUsername(username);
    const maskedUsername = maskUsername(username);

    if (existingUser) {
      logService.warn(`註冊失敗：嘗試的用戶名 (${maskedUsername})`);
      return res.status(400).json({ status: 'error', error: '用戶已存在' });
    }

    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10);

    // 如果未提供 roleId，預設為3 (normal user)
    const finalRoleId = roleId || 3;

    // 創建用戶
    await User.create(username, hashedPassword, finalRoleId);

    logService.info(`註冊成功：用戶名 (${maskedUsername})`);

    res.status(201).json({
      status: 'success',
      message: '註冊成功',
    });
  } catch (err) {
    logService.error(`註冊失敗：${err.message}`);
    res.status(500).json({
      status: 'error',
      error: '註冊失敗',
    });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 查找用戶
    const user = await User.findByUsername(username);
    const maskedUsername = maskUsername(username);

    if (!user) {
      logService.warn(`登入失敗：嘗試的用戶名 (${maskedUsername})`);
      return res
        .status(401)
        .json({ status: 'error', error: '密碼錯誤或用戶不存在' });
    }

    // 驗證密碼
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logService.warn(`登入失敗：嘗試的用戶名 (${maskedUsername})`);
      return res
        .status(401)
        .json({ status: 'error', error: '密碼錯誤或用戶不存在' });
    }

    // 生成 Access Token 和 Refresh Token
    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });
    const refreshToken = await RefreshToken.createToken(
      user.id,
      config.refreshToken.cookieOptions.maxAge
    );

    // 設置 HttpOnly Cookie
    res.cookie(
      config.accessToken.cookieName,
      accessToken,
      config.accessToken.cookieOptions
    );

    res.cookie(
      config.refreshToken.cookieName,
      refreshToken,
      config.refreshToken.cookieOptions
    );

    logService.info(`登入成功：用戶名 (${maskedUsername})`);
    res.json({ status: 'success', message: '登入成功' });
  } catch (err) {
    res.status(500).json({ status: 'error', error: '伺服器錯誤，請稍後再試' });
  }
};

exports.refreshAccessToken = async (req, res) => {
  const token = req.refreshToken; // Middleware 已提取 Refresh Token

  try {
    const refreshToken = await RefreshToken.verifyToken(token); // 驗證 Refresh Token

    const newAccessToken = jwt.sign(
      { id: refreshToken.userId },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h', // Access Token 有效期 1 小時
      }
    );

    // 更新 Access Token Cookie
    res.cookie('accessToken', newAccessToken, config.accessToken.cookieOptions);

    res.json({
      status: 'success',
      message: 'Access Token已被更新',
    });
  } catch (err) {
    return res.status(403).json({
      status: 'error',
      error: err.message,
    });
  }
};

exports.revokeRefreshToken = async (req, res) => {
  const token = req.refreshToken; // Middleware 已提取 Refresh Token

  try {
    await RefreshToken.revokeToken(token); // 撤銷 Refresh Token
    res.clearCookie(config.refreshToken.cookieName); // 清除 Refresh Token Cookie
    res.clearCookie(config.accessToken.cookieName); // 清除 Access Token Cookie
    res.json({
      status: 'success',
      message: '登出成功',
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      error: '撤銷Token失敗',
    });
  }
};
