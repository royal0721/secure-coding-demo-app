const db = require('../config/db');

class Role {
  static async findByName(name) {
    const query = 'SELECT * FROM roles WHERE name = ?';
    const [rows] = await db.promise().query(query, [name]);
    return rows[0];
  }

  static async getPermissions(roleId) {
    const query = `SELECT p.name
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = ?
    `;
    const [rows] = await db.promise().query(query, [roleId]);
    return rows.map((row) => row.name);
  }
}

module.exports = Role;
