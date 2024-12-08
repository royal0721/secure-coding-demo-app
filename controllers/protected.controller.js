const postProtectedEndpoint = (req, res) => {
  const { data } = req.body;
  // handle the action after completing the csrf protection.
  res.json({ message: 'Protected operation succeeded', data });
};

module.exports = { postProtectedEndpoint };
