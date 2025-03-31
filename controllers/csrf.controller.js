const { generateToken } = require("../middlewares/csrf.middleware");

const getCsrfToken = (req, res) => {
  res.json({ csrfToken: generateToken(req, res) });
};

module.exports = { getCsrfToken };
