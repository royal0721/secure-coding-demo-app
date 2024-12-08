const logService = require('../services/log.service');

const { invalidCsrfTokenError } = require('csrf-csrf');

// 處理 CSRF 錯誤
const csrfErrorHandler = (err, req, res, next) => {
  if (err === invalidCsrfTokenError) {
    return res.status(403).json({ error: 'CSRF validation failed' });
  }
  next(err);
};

// 錯誤處理中間件
const errorHandler = (err, req, res, next) => {
  // 那這邊的Logger不用嗎？
  // 不用加密？
  // 記錄錯誤資訊
  logService.error(`錯誤訊息: ${err.message}`);
  logService.error(`錯誤堆疊: ${err.stack}`);

  // 如果是開發環境，回傳完整錯誤訊息
  if (process.env.NODE_ENV !== 'production') {
    return res.status(500).json({
      error: '伺服器錯誤',
      message: err.message,
      stack: err.stack,
    });
  }

  // 生產環境，僅返回簡化錯誤訊息
  res.status(500).json({
    error: '伺服器錯誤，請稍後再試。',
  });
};

module.exports = { csrfErrorHandler, errorHandler };
