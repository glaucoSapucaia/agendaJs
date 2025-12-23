exports.index = (req, res) => {
  res.render("login");
};
exports.login = (req, res) => {
  res.send(req.body);
};
