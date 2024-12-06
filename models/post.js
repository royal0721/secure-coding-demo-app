const db = require('../config/db');

const Post = {
  // 獲取所有貼文
  getAll: async () => {
    const query = 'SELECT * FROM posts';
    const [rows] = await db.promise().query(query);
    return rows;
  },

  // 創建新貼文
  create: async (name) => {
    const query = 'INSERT INTO posts (name) VALUES (?)';
    const [result] = await db.promise().query(query, [name]);
    return result.insertId; // 返回新插入的貼文 ID
  },

  // 更新貼文
  update: async (id, name) => {
    const query = 'UPDATE posts SET name = ? WHERE id = ?';
    const [result] = await db.promise().query(query, [name, id]);
    return result.affectedRows; // 返回受影響的行數
  },

  // 刪除貼文
  delete: async (id) => {
    const query = 'DELETE FROM posts WHERE id = ?';
    const [result] = await db.promise().query(query, [id]);
    return result.affectedRows; // 返回受影響的行數
  },
};

module.exports = Post;
