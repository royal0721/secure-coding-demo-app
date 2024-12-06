const db = require('../config/db');

const Post = {
  // 獲取所有帖子
  getAll: async () => {
    const query = 'SELECT * FROM posts';
    const [rows] = await db.promise().query(query);
    return rows;
  },

  // 創建新帖子
  create: async (name) => {
    const query = 'INSERT INTO posts (name) VALUES (?)';
    const [result] = await db.promise().query(query, [name]);
    return result.insertId; // 返回新插入的帖子 ID
  },

  // 更新帖子
  update: async (id, name) => {
    const query = 'UPDATE posts SET name = ? WHERE id = ?';
    const [result] = await db.promise().query(query, [name, id]);
    return result.affectedRows; // 返回受影響的行數
  },

  // 刪除帖子
  delete: async (id) => {
    const query = 'DELETE FROM posts WHERE id = ?';
    const [result] = await db.promise().query(query, [id]);
    return result.affectedRows; // 返回受影響的行數
  },
};

module.exports = Post;
