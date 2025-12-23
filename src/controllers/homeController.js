exports.index = (req, res) => {
  res.render("index", {
    titulo: "Page Title",
    numeros: [1, 2, 3, 4, 5],
  });
};

exports.homePagePost = (req, res) => {
  res.send(req.body);
};
