const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logService = require('../services/log.service');
const { maskUsername } = require('../utils/maskUtils');

exports.registerUser = async (req, res) => {
  const { username, password, roleId } = req.body;

  try {
    // 檢查用戶是否存在
    const existingUser = await User.findByUsername(username);
    const maskedUsername = maskUsername(username);

    if (existingUser) {
      logService.warn(`註冊失敗：嘗試的用戶名 (${maskedUsername})`);
    }

    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10);

    // 創建用戶
    await User.create(username, hashedPassword, roleId);

    logService.info(`註冊成功：用戶名 (${maskedUsername})`);
    res.status(201).json({ message: '註冊成功' });
  } catch (err) {
    res.status(500).json({ error: '註冊失敗' }); // 統一錯誤訊息
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
      return res.status(401).json({ error: '無效的憑證' });
    }

    // 驗證密碼
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logService.warn(`登入失敗：嘗試的用戶名 (${maskedUsername})`);
      return res.status(401).json({ error: '無效的憑證' });
    }

    // 生成 JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    logService.info(`登入成功：用戶名 (${maskedUsername})`);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
