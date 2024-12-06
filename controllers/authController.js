require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logService = require('../services/logService');

exports.registerUser = async (req, res) => {
  const { username, password, roleId } = req.body;

  try {
    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10);

    // 創建用戶
    await User.create(username, hashedPassword, roleId);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 查找用戶
    const user = await User.findByUsername(username);
    const maskedUsername = `${username[0]}***`;

    if (!user) {
      logService.warn(`登入失敗：嘗試的用戶名 (${maskedUsername})`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 驗證密碼
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logService.warn(`登入失敗：嘗試的用戶名 (${maskedUsername})`);
      return res.status(401).json({ error: 'Invalid credentials' });
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
