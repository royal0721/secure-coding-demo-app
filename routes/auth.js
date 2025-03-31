const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { extractRefreshToken } = require("../middlewares/auth.middleware");
const { verifyAccessToken } = require("../middlewares/auth.middleware");
const { registerValidator } = require("../middlewares/registerValidator.middleware");
const { handleValidationErrors } = require("../middlewares/validationResult.middleware");

router.post("/register", registerValidator, handleValidationErrors, authController.registerUser); // 用戶註冊
router.post("/login", authController.loginUser); // 用戶登錄
router.post("/refresh", extractRefreshToken, authController.refreshAccessToken); // 刷新 Access Token
router.post("/logout", extractRefreshToken, authController.revokeRefreshToken); // 撤銷 Refresh Token（登出）
router.get('/status', verifyAccessToken, (req, res) => {
    res.status(200).json({ status: "success", loggedIn: true, user: req.user });
});

module.exports = router;
