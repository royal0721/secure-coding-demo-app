require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();

// 中間件
app.use(bodyParser.json());

// 路由
app.use('/auth', authRoutes); // 認證路由
app.use('/posts', postRoutes); // 保護的記錄路由

// 啟動服務器
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
