const { body, validationResult } = require("express-validator");

const Post = require("../models/post");
const logService = require("../services/log.service");


const postsController = {
  // 取得特定貼文
  getPostById: async (req, res) => {
    const { id } = req.params;

    try {
      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).json({ status: "error", message: '找不到貼文' });
      }

      return res.status(200).json(post);
    } catch (err) {
      console.error('取得貼文失敗:', err);
      return res.status(500).json({ status: "error", message: '伺服器錯誤，無法取得貼文' });
    }
  },

  // 獲取所有記錄
  getAllPosts: async (req, res) => {
    try {
      const posts = await Post.getAll();
      return res.status(200).json(posts);
    } catch (err) {
      logService.error('取得貼文時發生錯誤：', err);
      return res.status(500).json({
        status: "error",
        message: "無法取得貼文"
      });
    }
  },

  // 創建新記錄
  createPost: [
    // 驗證和清理輸入
    body("name")
      .trim() // 移除前後空白
      .isLength({ min: 3, max: 50 }) // 限制名稱長度
      .withMessage("名稱必須介於 3 到 50 個字元之間")
      .matches(/^[\u4e00-\u9fa5a-zA-Z0-9\s]+$/) // 僅允許中文、英文字母、數字和空格
      .withMessage("名稱只能包含字母、數字和空格"),
    // Controller 主邏輯
    async (req, res) => {
      // 檢查驗證結果
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name } = req.body;

      try {
        const { id, createdAt } = await Post.create(name);
        return res.status(201).json({ status: "success", message: "建立貼文成功", id, name, createdAt });
      } catch (err) {
        logService.error('建立貼文時發生錯誤', err);
        return res.status(500).json({ status: "error", message: "建立貼文失敗" });
      }
    },
  ],

  // 更新記錄
  updatePost: async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ status: "error", message: "Name 為必填欄位" });
    }

    try {
      const affectedRows = await Post.update(id, name);

      if (affectedRows === 0) {
        return res.status(404).json({ status: "error", message: "貼文未找到" });
      }

      return res.status(200).json({ status: "success", message: "貼文成功被更新" });
    } catch (err) {
      logService.error('更新貼文時發生錯誤', err);
      return res.status(500).json({ status: "error", message: "更新貼文失敗" });
    }
  },

  // 刪除記錄
  deletePost: async (req, res) => {
    const { id } = req.params;

    try {
      const affectedRows = await Post.delete(id);

      if (affectedRows === 0) {
        return res.status(404).json({ status: "error", message: "貼文不存在" });
      }

      return res.status(200).json({ status: "success", message: "貼文已成功刪除" });
    } catch (err) {
      logService.error('刪除貼文時發生錯誤', err);
      return res.status(500).json({ status: "success", message: "刪除貼文失敗" });
    }
  },
};

module.exports = postsController;
