const express = require("express");
const router = express.Router();
const {
  getPostById,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/posts.controller");
const { verifyAccessToken } = require("../middlewares/auth.middleware");
const {
  checkPermission,
} = require("../middlewares/checkPermission.middleware");

router.get("/", verifyAccessToken, checkPermission("read_post"), getAllPosts);
router.get("/:id", verifyAccessToken, getPostById);

router.post("/", verifyAccessToken, checkPermission("create_post"), createPost);
router.put(
  "/:id",
  verifyAccessToken,
  checkPermission("update_post"),
  updatePost
);
router.delete(
  "/:id",
  verifyAccessToken,
  checkPermission("delete_post"),
  deletePost
);

module.exports = router;
