const { body } = require("express-validator");

exports.registerValidator = [
  body('username')
    .trim()
    .notEmpty().withMessage('用戶名為必填').bail()
    .isLength({ min: 3 }).withMessage('用戶名長度需至少為 3 字元').bail()
    .matches(/^\w+$/).withMessage('用戶名只能包含英文、數字與底線').bail(),

  body('password')
    .notEmpty().withMessage('密碼為必填').bail()
    .isLength({ min: 6 }).withMessage('密碼長度至少為 6 個字元').bail()
    .matches(/^(?=.*[a-z])/, "i").withMessage('密碼需包含小寫字母').bail()
    .matches(/^(?=.*[A-Z])/, "i").withMessage('密碼需包含大寫字母').bail()
    .matches(/^(?=.*\d)/).withMessage('密碼需包含數字').bail()
    .matches(/^(?=.*[!@#$%^&*(),.?":{}|<>_\-\\\/\[\]`~+=;'])/).withMessage('密碼需包含特殊符號').bail(),

  body('roleId')
    .optional()
    .isInt({ min: 1 }).withMessage('角色 ID 必須為正整數'),
];
