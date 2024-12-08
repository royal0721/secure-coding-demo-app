const { body, validationResult } = require('express-validator');

const Post = require('../models/post');

const postsController = {
  // 獲取所有記錄
  getAllPosts: async (req, res) => {
    try {
      const posts = await Post.getAll();
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve posts' });
    }
  },

  // 創建新記錄
  createPost: [
    // 驗證和清理輸入
    body('name')
      .trim() // 移除前後空白
      .isLength({ min: 3, max: 50 }) // 限制名稱長度
      .withMessage('Name must be between 3 and 50 characters')
      .matches(/^[a-zA-Z0-9\s]+$/) // 僅允許字母、數字和空格
      .withMessage('Name can only contain letters, numbers, and spaces'),
    // Controller 主邏輯
    async (req, res) => {
      // 檢查驗證結果
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name } = req.body;

      try {
        // 模擬創建記錄的功能（替換為你的實際數據庫操作）
        const postId = await Post.create(name); // 假設 Post.create 是一個 Promise
        res.status(201).json({ id: postId, name });
      } catch (err) {
        res.status(500).json({ error: 'Failed to create post' });
      }
    },
  ],

  // 更新記錄
  updatePost: async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    try {
      const affectedRows = await Post.update(id, name);

      if (affectedRows === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }

      res.status(200).json({ message: 'Post updated successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update post' });
    }
  },

  // 刪除記錄
  deletePost: async (req, res) => {
    const { id } = req.params;

    try {
      const affectedRows = await Post.delete(id);

      if (affectedRows === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }

      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete post' });
    }
  },
};

module.exports = postsController;
