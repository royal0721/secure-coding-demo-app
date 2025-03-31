const User = require('../models/user');
const Role = require('../models/role');

exports.checkPermissionLogic = async (userId, permission) => {
    const roleId = await User.findRoleIdByUserId(userId);
    const permissions = await Role.getPermissions(roleId);

    return permissions.includes(permission);
};