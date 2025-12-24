exports.authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    req.flash("errors", "Acesso não autorizado!");
    req.session.save(() => {
      res.redirect("/login");
      return;
    });
    return;
  }

  next();
};
