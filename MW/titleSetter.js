const titleSetter = (TITLE) => (req, res, next) => {
  res.locals.title = `${TITLE} - ${process.env.appName}`;
  res.locals.html = "html";

  //For avoiding templating error
  //creating some placeholders
  res.locals.loggedInUser = {};
  res.locals.errors = {};
  res.locals.data = {};

  next();
};

module.exports = titleSetter;
