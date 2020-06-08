const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = mongoose.model("User");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = new User({ email, password });
    await user.save(); // save() is an asynchronous method that will add the user to the database

    // _id comes from MongoDB, an ID is automatically assigned to each user that gets added to database
    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
    res.send({ token });
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({
      error: "Must provide email and password",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).send({
      error: "Invalid email or password",
    });
  }

  try {
    // see User Schema for this method
    await user.comparePassword(password);
    // after comparing passwords, give them a token so they
    // can authenticate themselves when they make any more request (by interacting with any part of the app)
    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
    res.send({ token });
  } catch (err) {
    return res.status(422).send({
      error: "Invalid email or password",
    });
  }
});

module.exports = router;
