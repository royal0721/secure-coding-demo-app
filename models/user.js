const db = require("../config/db");

class User {
  static async create(username, password, roleId) {
    const query = "INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)";
    return db.query(query, [username, password, roleId]);
  }

  static async findByUsername(username) {
    const query = "SELECT * FROM users WHERE username = ?";
    const [rows] = await db.query(query, [username]);
    return rows[0];
  }

  static async findRoleIdByUserId(userId) {
    const query = "SELECT role_id FROM users WHERE id = ?";
    const [rows] = await db.query(query, [userId]);
    return rows[0]?.role_id || null;
  }
}

module.exports = User;