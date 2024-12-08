const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/posts.controller');
const { verifyJWT } = require('../middlewares/verifyJWT.middleware');
const {
  checkPermission,
} = require('../middlewares/checkPermission.middleware');

router.get('/', verifyJWT, checkPermission('read_post'), getAllPosts);
router.post('/', verifyJWT, checkPermission('create_post'), createPost);
router.put('/:id', verifyJWT, checkPermission('update_post'), updatePost);
router.delete('/:id', verifyJWT, checkPermission('delete_post'), deletePost);

module.exports = router;
