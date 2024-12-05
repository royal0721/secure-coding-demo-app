const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postsController');
const { verifyJWT } = require('../middleware/verifyJWT');
const { checkPermission } = require('../middleware/checkPermission');

router.get('/', verifyJWT, checkPermission('read_post'), getAllPosts);
router.post('/', verifyJWT, checkPermission('create_post'), createPost);
router.put('/:id', verifyJWT, checkPermission('update_post'), updatePost);
router.delete('/:id', verifyJWT, checkPermission('delete_record'), deletePost);

module.exports = router;
