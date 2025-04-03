const { checkPermissionLogic } = require("../utils/checkPermissionLogic");

exports.checkPermission = (permission) => {
  return async (req, res, next) => {
    const userId = req.user.userId;
    const isPermitted = await checkPermissionLogic(userId, permission);

    if (isPermitted) {
      next();
    } else {
      return res.status(403).json({ status: "error", message: "拒絕存取" });
    }
  };
};
