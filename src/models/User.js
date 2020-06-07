const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true, // dont want duplicate emails
    required: true, // makes the 'email' property required (b/c we want every user to be created with an email)
  },
  password: {
    type: String,
    required: true,
  },
});

// associate userSchema with mongoose
mongoose.model("User", userSchema);
