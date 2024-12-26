const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { extractRefreshToken } = require('../middlewares/auth.middleware');

router.post('/register', authController.registerUser); // 用戶註冊
router.post('/login', authController.loginUser); // 用戶登錄
router.post('/refresh', extractRefreshToken, authController.refreshAccessToken); // 刷新 Access Token
router.post('/logout', extractRefreshToken, authController.revokeRefreshToken); // 撤銷 Refresh Token（登出）

module.exports = router;
