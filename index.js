const dotenv = require("dotenv");

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

const express = require("express");
const bodyParser = require("body-parser");

const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const permissionRoutes = require("./routes/permissions");

const { errorHandler } = require("./middlewares/error.middleware");
const cookieParser = require("cookie-parser");

const cors = require("cors"); // 引入 CORS 中間件

const logService = require("./services/log.service");

const app = express();

// 配置CORS (如果沒有設置Nginx，可以把註解的地方去掉，使用這個進行測試)
// 注意，若未設置Nginx，這個設置CSRF會驗證不通過
app.use(
  cors({
    // origin: "http://localhost:4200", // 允許來自 Angular 客戶端的請求 (請讀者自行替換)
    // methods: ["GET", "POST", "PUT", "DELETE"], // 允許的 HTTP 方法
    credentials: true, // 是否允許攜帶 cookie 等憑證
  })
);

// middleware
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// 路由
app.use("/csrf", indexRoutes);

app.use("/auth", authRoutes); // 認證路由
app.use("/posts", postRoutes); // 保護的記錄路由
app.use("/permissions", permissionRoutes); // 保護的記錄路由

// 使用 Express 錯誤處理中間件
app.use(errorHandler);

// 全域錯誤處理（未捕捉的異常）
process.on("uncaughtException", (err) => {
  const isProd = process.env.NODE_ENV === 'production';
  logService.error(`未捕捉異常: ${err.message}`);

  if (!isProd) {
    logService.error(`堆疊資訊: ${err.stack}`); // 測試環境比較適合紀錄 stack trace
  } else {
    logService.error(`堆疊資訊已略過（production 模式）`);
  }

  process.exit(1); // 終止應用程式
});

process.on("unhandledRejection", (reason, promise) => {
  logService.error(`未捕捉的 Promise 拒絕: ${reason}`);
  logService.error(`相關的 Promise: ${promise}`);
});

// 啟動服務器
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`伺服器正在執行於埠號 ${PORT}`);
});
