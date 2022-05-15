//USERS CONTROLLERS
//Scafolding
const wrapper = {};

const bcrypt = require("bcrypt");
const PEOPLE = require("../Models/PeopleModel");
const path = require("path");
const { unlink } = require("fs");

//GET CONTROL
wrapper.usersGetControl = async (req, res) => {
  try {
    const usersData = await PEOPLE.find({}, { password: 0 });
    if (req.accepts("html")) {
      res.locals.usersData = usersData;
      res.render("users");
    } else {
      res.json({ data: usersData });
    }
  } catch (err) {
    if (req.accepts("html")) {
      res.locals.error = err;
      res.render("error");
    } else {
      res.json({ error: err });
    }
  }
};

//POST CONTROL
wrapper.usersPostControl = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  let userInfo;

  if (req.files && req.files.length > 0) {
    userInfo = {
      ...req.body,
      password: hashedPassword,
      avatar: req.files[0].filename,
    };
  } else {
    userInfo = {
      ...req.body,
      password: hashedPassword,
    };
  }

  try {
    const newUser = new PEOPLE(userInfo);
    const result = await newUser.save();
    res.status(200).json({
      message: "User was added Successfully",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          message: "Unknown error occured",
        },
      },
    });
  }
};

//DELETE CONTROL
wrapper.usersDeleteControl = async (req, res) => {
  const userId = req.params.id;
  try {
    const userToBeDeleted = await PEOPLE.findByIdAndDelete({ _id: userId });

    if (userToBeDeleted.avatar) {
      unlink(
        path.join(
          __dirname,
          `/../public/uploads/avatar/${userToBeDeleted.avatar}`
        ),
        () => {
          res.json({
            error: false,
            message: "USER was Successfully deleted",
          });
        }
      );
    } else {
      res.json({
        error: false,
        message: "USER was Successfully deleted",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: true,
      message: "Couldn't delete user Properly",
    });
  }
};

module.exports = wrapper;
