const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../middlewares/auth.middleware");
const { checkPermissionLogic } = require("../utils/checkPermissionLogic");

router.get('/check', verifyAccessToken, async (req, res) => {
    const { permission } = req.query;
    const userId = req.user.userId;

    if (!permission) {
        return res.status(400).json({ status: 'error', message: '缺少權限名稱' });
    }

    try {
        const isPermitted = await checkPermissionLogic(userId, permission);
        return res.status(200).json({ status: 'success', message: '權限查詢成功', isPermitted });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 'error', message: '權限查詢失敗' });
    }
});

module.exports = router;