const db = require('../config/db');

const postsController = {
  // 1. 獲取所有記錄
  getAllPosts: async (req, res) => {
    try {
      const query = 'SELECT * FROM posts';
      const [rows] = await db.promise().query(query);
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve posts' });
    }
  },

  // 2. 創建新記錄
  createPost: async (req, res) => {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    try {
      const query = 'INSERT INTO posts (name) VALUES (?)';
      const [result] = await db.promise().query(query, [name]);
      res.status(201).json({ id: result.insertId, name });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create post' });
    }
  },

  // 3. 更新記錄
  updatePost: async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    try {
      const query = 'UPDATE posts SET name = ? WHERE id = ?';
      const [result] = await db.promise().query(query, [name, id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }

      res.status(200).json({ message: 'Post updated successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update post' });
    }
  },

  // 4. 刪除記錄
  deletePost: async (req, res) => {
    const { id } = req.params;

    try {
      const query = 'DELETE FROM posts WHERE id = ?';
      const [result] = await db.promise().query(query, [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }

      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete post' });
    }
  },
};

module.exports = postsController;
