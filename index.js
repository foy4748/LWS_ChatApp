//Dependencies
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const http = require("http");
const socket = require("socket.io");
const cors = require("cors");

const app = express(); //Executing ExpressJS

const server = http.createServer(app);
const io = socket(server);

global.io = io; //Storing the socket I\O inside the global variable

dotenv.config(); //Accessing Environment Variables
require("./dbConnect"); //Connecting DB

//App Usage
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public/")));
app.use(cookieParser(process.env.cookieSecret));
app.use(
  cors({
    origin: process.env.APP_URL,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

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

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () =>
  console.log(`Server is listening to port ${PORT}`)
);
