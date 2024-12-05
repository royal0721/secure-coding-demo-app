const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.registerUser); // 用戶註冊
router.post('/login', authController.loginUser); // 用戶登錄

module.exports = router;
