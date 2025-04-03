const { createLogger, format, transports } = require("winston");
// 設定日誌格式
const logFormat = format.combine(
  // 加入時間戳
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  // 格式化輸出
  format.printf(
    ({ timestamp, level, message }) => `${String(timestamp)} [${level}]: ${String(message)}`
  )
);
// 創建Logger實例
const logger = createLogger({
  // 默認級別為info
  level: process.env.LOG_LEVEL || "info",
  format: logFormat,
  transports: [
    // 輸出到控制台
    new transports.Console(),
    // 錯誤日誌
    new transports.File({ filename: "logs/error.log", level: "error" }),
    // 所有日誌
    new transports.File({ filename: "logs/combined.log" }),
  ],
});
// 在開發環境中啟用顏色化輸出
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), logFormat),
    })
  );
}
// 封裝Log Service
const logService = {
  info: (message) => logger.info(message),
  warn: (message) => logger.warn(message),
  error: (message) => logger.error(message),
};
module.exports = logService;
