const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

// a pre-save hook which will run before saving a user to the database
// NOTTE: we mustt use the keyword "function" instead of an arrow function ()=>{} because the user
// will be stored in the "this" keyword. If you use an arrow function the value of "this" changes
//  to refer to context of this file as a whole, which is not what we want.
userSchema.pre("save", function (next) {
  const user = this;

  // if the password for this user has not been changed
  if (!user.isModified("password")) {
    return next(); // move on to the next thing
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next(); // continue with the saving process
    });
  });
});

// "candidatePassword" is the password the user tries to login with
userSchema.methods.comparePassword = function comparePassword(
  candidatePassword
) {
  // the user object in a function that uses the 'function' keyword is stored in "this"
  const user = this;

  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }

      if (!isMatch) {
        return reject(false);
      }

      resolve(true);
    });
  });
};

// associate userSchema with mongoose
mongoose.model("User", userSchema);
