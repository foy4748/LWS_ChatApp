//inbox CONTROLLERS
//Scafolding
const wrapper = {};

wrapper.inboxGetControl = (req, res) => {
  if (req.accepts("html")) {
    res.render("inbox");
  } else {
    res.json({ message: "This is the inbox page" });
  }
};

module.exports = wrapper;
