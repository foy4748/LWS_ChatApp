const httpError = require("http-errors");

const notFoundErrorHandler = (req, res, next) => {
  next(httpError(404, "Your requested content was not found"));
};

const errorHandler = (error, req, res, next) => {
  res.locals.error =
    process.env.NODE_ENV === "development" ? error : error.message;

  res.locals.title = "| Error |";
  res.status(error.status || 500);

  if (req.accepts("html") === "html") {
    res.render("error");
  } else {
    res.json(error);
  }
};

module.exports = {
  notFoundErrorHandler,
  errorHandler,
};
