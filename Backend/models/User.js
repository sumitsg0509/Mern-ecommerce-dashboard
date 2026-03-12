// mongoose import करतो
const mongoose = require("mongoose");

// user schema define करतो
// database मध्ये user ची structure कशी असेल ते इथे define करतो
const userSchema = new mongoose.Schema({

  // user name store होईल
  name: String,

  // user email store होईल
  email: String,

  // user password store होईल
  password: String

});

// schema वरून model तयार करतो
// "users" नावाने MongoDB collection तयार होईल
module.exports = mongoose.model("users", userSchema);