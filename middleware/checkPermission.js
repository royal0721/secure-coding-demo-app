const db = require('../config/db');

exports.checkPermission = (permission) => {
  return async (req, res, next) => {
    const roleId = req.user.role;

    const query = `
      SELECT p.name
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = ?
    `;
    const [rows] = await db.promise().query(query, [roleId]);
    const permissions = rows.map((row) => row.name);

    if (permissions.includes(permission)) {
      next();
    } else {
      res.status(403).json({ error: 'Access denied' });
    }
  };
};
