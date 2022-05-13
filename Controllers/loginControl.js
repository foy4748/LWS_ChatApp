//LOGIN CONTROLLERS
//Scafolding
const wrapper = {};

wrapper.loginGetControl = (req, res) => {
  if (req.accepts("html")) {
    res.render("index");
  } else {
    res.json({ message: "This is the LogIn page" });
  }
};

module.exports = wrapper;
