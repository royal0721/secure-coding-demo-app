const { validationResult } = require('express-validator');

exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      message: "註冊失敗，請重新查閱帳號密碼規則",
      errors: errors.array(),
    });
  }
  next();
};