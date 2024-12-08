const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// 簡化版的資料庫連線處理，實際應用中應考慮加入斷線重試或其他錯誤處理機制
db.connect((err) => {
  if (err) {
    console.error('無法連接到資料庫:', err);
  } else {
    console.log('已連接到MySQL資料庫');
  }
});

module.exports = db;
