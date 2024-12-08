const { body, validationResult } = require('express-validator');

const Post = require('../models/post');

const postsController = {
  // 獲取所有記錄
  getAllPosts: async (req, res) => {
    try {
      const posts = await Post.getAll();
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json({ error: '無法取得貼文' });
    }
  },

  // 創建新記錄
  createPost: [
    // 驗證和清理輸入
    body('name')
      .trim() // 移除前後空白
      .isLength({ min: 3, max: 50 }) // 限制名稱長度
      .withMessage('名稱必須介於 3 到 50 個字元之間')
      .matches(/^[a-zA-Z0-9\s]+$/) // 僅允許字母、數字和空格
      .withMessage('名稱只能包含字母、數字和空格'),
    // Controller 主邏輯
    async (req, res) => {
      // 檢查驗證結果
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name } = req.body;

      try {
        const postId = await Post.create(name);
        res.status(201).json({ id: postId, name });
      } catch (err) {
        res.status(500).json({ error: '建立貼文失敗' });
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
        return res.status(404).json({ error: '貼文未找到' });
      }

      res.status(200).json({ message: '貼文成功被更新' });
    } catch (err) {
      res.status(500).json({ error: '更新貼文失敗' });
    }
  },

  // 刪除記錄
  deletePost: async (req, res) => {
    const { id } = req.params;

    try {
      const affectedRows = await Post.delete(id);

      if (affectedRows === 0) {
        return res.status(404).json({ error: '貼文不存在' });
      }

      res.status(200).json({ message: '貼文已成功刪除' });
    } catch (err) {
      res.status(500).json({ error: '刪除貼文失敗' });
    }
  },
};

module.exports = postsController;
