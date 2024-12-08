const dotenv = require('dotenv');

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const express = require('express');
const bodyParser = require('body-parser');

const indexRoutes = require('./routes/index');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const { errorHandler } = require('./middlewares/error.middleware');
const cookieParser = require('cookie-parser');

const app = express();

// middleware
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// 路由
app.use('/csrf', indexRoutes);

app.use('/auth', authRoutes); // 認證路由
app.use('/posts', postRoutes); // 保護的記錄路由

// 使用 Express 錯誤處理中間件
app.use(errorHandler);

// 全域錯誤處理（未捕捉的異常）
process.on('uncaughtException', (err) => {
  logService.error(`未捕捉異常: ${err.message}`);
  logService.error(`堆疊資訊: ${err.stack}`);
  process.exit(1); // 終止應用程式
});

process.on('unhandledRejection', (reason, promise) => {
  logService.error(`未捕捉的 Promise 拒絕: ${reason}`);
  logService.error(`相關的 Promise: ${promise}`);
});

// 啟動服務器
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
