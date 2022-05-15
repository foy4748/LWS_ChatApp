const mongoose = require("mongoose");

const People_Obj = {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: String,
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
};

const People_ModelOptions = {
  timestamps: true,
};

const People_Schema = mongoose.Schema(People_Obj, People_ModelOptions);

const People_Model = mongoose.model("People", People_Schema);

module.exports = People_Model;
