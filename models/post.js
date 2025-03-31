const db = require("../config/db");

const Post = {
  // 取得特定貼文
  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [id]);
    return rows[0] || null;
  },

  // 獲取所有貼文
  getAll: async () => {
    const query = "SELECT * FROM posts";
    const [rows] = await db.query(query);
    return rows;
  },

  // 創建新貼文
  create: async (name) => {
    const insertQuery = "INSERT INTO posts (name) VALUES (?)";
    const [result] = await db.query(insertQuery, [name]);

    const postId = result.insertId;

    const selectQuery = "SELECT * FROM posts WHERE id = ?";
    const [rows] = await db.query(selectQuery, [postId]);

    return rows[0];
  },

  // 更新貼文
  update: async (id, name) => {
    const query = "UPDATE posts SET name = ? WHERE id = ?";
    const [result] = await db.query(query, [name, id]);
    return result.affectedRows; // 返回受影響的行數
  },

  // 刪除貼文
  delete: async (id) => {
    const query = "DELETE FROM posts WHERE id = ?";
    const [result] = await db.query(query, [id]);
    return result.affectedRows; // 返回受影響的行數
  },
};

module.exports = Post;
