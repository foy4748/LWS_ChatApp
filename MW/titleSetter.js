const titleSetter = (TITLE) => (req, res, next) => {
  res.locals.title = `${TITLE} - ${process.env.appName}`;
  next();
};

module.exports = titleSetter;
