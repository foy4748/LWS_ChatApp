const redirectLoggedIn = (req, res, next) => {
  const cookie = req.signedCookies;
  if (
    cookie[process.env.cookieName] &&
    cookie[process.env.cookieName].length > 0
  ) {
    res.redirect("/inbox");
  } else {
    next();
  }
};

module.exports = redirectLoggedIn;
