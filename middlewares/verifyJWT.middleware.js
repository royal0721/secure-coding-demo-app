require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.verifyJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: '未經授權：未提供Token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: '未經授權：無效的Token' });
  }
};
