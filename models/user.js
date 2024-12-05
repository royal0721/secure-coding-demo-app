const db = require('../config/db');

class User {
  static async create(username, password, roleId) {
    const query = 'INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)';
    return db.promise().query(query, [username, password, roleId]);
  }

  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = ?';
    const [rows] = await db.promise().query(query, [username]);
    return rows[0];
  }
}

module.exports = User;