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
  createPost: async (req, res) => {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    try {
      const postId = await Post.create(name);
      res.status(201).json({ id: postId, name });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create post' });
    }
  },

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
