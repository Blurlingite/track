const mongoose = require("mongoose");

const pointSchema = new mongoose.Schema({
  timestamp: Number,
  coords: {
    latitude: Number,
    longitude: Number,
    altitude: Number,
    accuracy: Number,
    heading: Number,
    speed: Number,
  },
});

const trackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // tells mongoose that userId points to an instance of a User which is the line: "mongoose.model("User", userSchema);" in User.js
  },
  name: {
    type: String,
    default: "",
  },
  locations: [pointSchema], // an array of pointSchema
});

mongoose.model("Track", trackSchema);
