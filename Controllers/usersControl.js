//USERS CONTROLLERS
//Scafolding
const wrapper = {};

wrapper.usersGetControl = (req, res) => {
  if (req.accepts("html")) {
    res.render("users");
  } else {
    res.json({ message: "This is the USERS page" });
  }
};

module.exports = wrapper;
