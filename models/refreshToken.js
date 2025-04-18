const db = require("../config/db"); 
const { v4: uuidv4 } = require("uuid");

const RefreshToken = {
  // 生成 Refresh Token
  async createToken(userId, jwtRefreshExpiration) {
    const token = uuidv4(); // 生成唯一 Token
    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + jwtRefreshExpiration); // 設置過期時間

    const query = `
      INSERT INTO refreshTokens (token, userId, expiryDate) 
      VALUES (?, ?, ?)
    `;
    await db.query(query, [token, userId, expiryDate]);

    return token;
  },

  // 驗證 Refresh Token
  async verifyToken(token) {
    const query = "SELECT * FROM refreshTokens WHERE token = ?";
    const [rows] = await db.query(query, [token]);

    if (rows.length === 0) {
      throw new Error("Refresh Token not found");
    }

    const refreshToken = rows[0];

    if (refreshToken.isRevoked) {
      throw new Error("Refresh Token has been revoked");
    }

    if (new Date(refreshToken.expiryDate) < new Date()) {
      throw new Error("Refresh Token has expired");
    }

    return refreshToken;
  },

  // 撤銷 Refresh Token
  async revokeToken(token) {
    const query = "UPDATE refreshTokens SET isRevoked = TRUE WHERE token = ?";
    await db.query(query, [token]);
  },
};

module.exports = RefreshToken;
