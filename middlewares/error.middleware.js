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
  // 記錄錯誤資訊
  logService.error(`錯誤訊息: ${err.message}`);
  logService.error(`錯誤堆疊: ${err.stack}`);

  // 返回簡化錯誤訊息
  res.status(500).json({
    error: '伺服器錯誤，請稍後再試。',
  });
};

module.exports = { csrfErrorHandler, errorHandler };
