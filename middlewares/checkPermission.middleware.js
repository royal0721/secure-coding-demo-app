const Role = require('../models/role');

exports.checkPermission = (permission) => {
  return async (req, res, next) => {
    const roleId = req.user.role;

    const permissions = await Role.getPermissions(roleId);

    if (permissions.includes(permission)) {
      next();
    } else {
      res.status(403).json({ error: '存取被拒絕' });
    }
  };
};
