const postProtectedEndpoint = (req, res) => {
  const { data } = req.body;
  // handle the action after completing the csrf protection.
  res.json({ message: "受保護的操作成功完成", data });
};

module.exports = { postProtectedEndpoint };
