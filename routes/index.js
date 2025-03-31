const express = require("express");
const { getCsrfToken } = require("../controllers/csrf.controller");
const {
  postProtectedEndpoint,
} = require("../controllers/protected.controller");
const { doubleCsrfProtection } = require("../middlewares/csrf.middleware");
const { csrfErrorHandler } = require("../middlewares/error.middleware");

const router = express.Router();

// CSRF Token 路由
router.get("/csrf-token", getCsrfToken);

// 受保護的路由
router.post(
  "/protected-endpoint",
  doubleCsrfProtection,
  csrfErrorHandler,
  postProtectedEndpoint
);

module.exports = router;
