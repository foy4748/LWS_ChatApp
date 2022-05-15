const adminGuard = (req, res, next) => {
  if (res.locals.loggedInUser.userRole === "admin") {
    next();
  } else {
    if (req.accepts("html")) {
      res.render("index", {
        errors: {
          auth: {
            msg: "Only for Admins. Please, Log into Admin account",
          },
        },
      });
    } else {
      res.status(500).send({
        errors: {
          auth: {
            msg: "Only for Admins. Please, Log into Admin account",
          },
        },
      });
    }
  }
};

module.exports = adminGuard;
