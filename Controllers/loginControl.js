//LOGIN CONTROLLERS
//Scafolding
const wrapper = {};

const PEOPLE = require("../Models/PeopleModel");
const bcrypt = require("bcrypt");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");

wrapper.loginGetControl = (req, res) => {
  if (req.accepts("html")) {
    res.render("index");
  } else {
    res.json({ message: "This is the LogIn page" });
  }
};

wrapper.loginPostControl = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await PEOPLE.findOne({
      $or: [{ email: username }, { mobile: username }],
    });

    if (user && user._id) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        const tokenData = {
          userId: user._id,
          userName: user.name,
          mobile: user.mobile,
          email: user.email,
          userRole: user.role,
          userAvatar: user.avatar,
        };
        const tokenOptions = {
          expiresIn: process.env.jwtExpirey,
        };

        const token = jwt.sign(tokenData, process.env.jwtSecret, tokenOptions);

        //Setting Cookie
        res.cookie(process.env.cookieName, token, {
          maxAge: process.env.jwtExpirey,
          httpOnly: true,
          signed: true,
        });

        res.locals.loggedInUser = tokenData;
        res.redirect("/inbox");
      } else {
        createError("Authentication Failed!");

        if (req.accepts("html")) {
          res.render("index", {
            data: {
              username: req.body.username,
            },
            errors: {
              password: {
                msg: "LogIn failed",
              },
            },
          });
        } else {
          res.status(500).send({
            data: {
              username: req.body.username,
            },
            errors: {
              password: {
                msg: "LogIn failed",
              },
            },
          });
        }
      }
    } else {
      createError("USER not FOUND");
      if (req.accepts("html")) {
        res.render("index", {
          data: {
            username: req.body.username,
          },
          errors: {
            username: {
              msg: "LogIn failed",
            },
          },
        });
      } else {
        res.status(500).send({
          data: {
            username: req.body.username,
          },
          errors: {
            username: {
              msg: "LogIn failed",
            },
          },
        });
      }
    }
  } catch (error) {
    if (req.accepts("html")) {
      res.render("index", {
        data: {
          username: req.body.username,
        },
        errors: {
          common: {
            msg: error.message,
          },
        },
      });
    } else {
      res.status(500).send({
        data: {
          username: req.body.username,
        },
        errors: {
          common: {
            msg: error.message,
          },
        },
      });
    }
  }
};

//LOGOUT
wrapper.loginDeleteControl = (req, res) => {
  res.clearCookie(process.env.cookieName);
  res.json({
    loggedOut: true,
  });
};

module.exports = wrapper;
