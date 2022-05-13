const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Local MongoDB is now CONNECTED"))
  .catch((error) => console.log(error));
