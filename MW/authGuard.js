const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const authGuard = async (req, res, next) => {
  const cookie = req.signedCookies;
  try {
    if (cookie[`${process.env.cookieName}`]) {
      const decode = jwt.verify(
        cookie[`${process.env.cookieName}`],
        process.env.jwtSecret
      );
      if (decode && decode.userId) {
        res.locals.loggedInUser = decode;
        next();
      } else {
        if (req.accepts("html")) {
          res.locals.errors = {
            auth: {
              msg: "NOT Authorized. Please, Login",
            },
          };
          res.render("index", {
            errors: {
              auth: {
                msg: "NOT Authorized. Please, Login",
              },
            },
          });
        } else {
          res.status(500).send({
            errors: {
              auth: {
                msg: "NOT Authorized. Please, Login",
              },
            },
          });
        }
      }
    } else {
      if (req.accepts("html")) {
        res.locals.errors = {
          auth: {
            msg: "NOT Authorized. Please, Login",
          },
        };
        res.render("index", {
          errors: {
            auth: {
              msg: "NOT Authorized. Please, Login",
            },
          },
        });
      } else {
        res.status(500).send({
          errors: {
            auth: {
              msg: "NOT Authorized. Please, Login",
            },
          },
        });
      }
    }
    /////
  } catch (error) {
    if (req.accepts("html")) {
      res.render("index", {
        errors: {
          common: {
            msg: error.message,
          },
        },
      });
    } else {
      res.status(500).send({
        errors: {
          common: {
            msg: error.message,
          },
        },
      });
    }
  }
};

module.exports = authGuard;
