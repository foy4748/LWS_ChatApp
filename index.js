//Dependencies
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config(); //Accessing Environment Variables
require("./dbConnect"); //Connecting DB
const app = express(); //Executing ExpressJS

//App Usage
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public/")));
app.use(cookieParser(process.env.cookieSecret));

//App Settings
app.set("view engine", "ejs");

//Middlewares Importing
const { notFoundErrorHandler, errorHandler } = require("./MW/errorHandler");

//Importing Routes
const loginRoute = require("./routes/loginRoute");
const usersRoute = require("./routes/usersRoute");
const inboxRoute = require("./routes/inboxRoute");

//App USE Routes
app.use("/", loginRoute);
app.use("/users", usersRoute);
app.use("/inbox", inboxRoute);
//END of App USE Routes - - - - - - - - - - - - - - - - - - - -

//Error Handlers ~ -~ -~ -~ -~ -~ -~ -~ -~ -~ -~ -~ -~ -~ -~ -~ -~ -~ -~ -~ -

//Handling NOT FOUND Errors
app.use(notFoundErrorHandler);

//Handling Common Errors
app.use(errorHandler);

app.listen(process.env.port, () =>
  console.log(`Server is listening to port ${process.env.port}`)
);