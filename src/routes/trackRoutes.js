const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

const Track = mongoose.model("Track");

const router = express.Router();

// require user to be signed in
// everything defined in this file will make use of our requireAuth middleware
router.use(requireAuth);

router.get("/tracks", async (req, res) => {
  // get user ID
  const tracks = await Track.find({ userId: req.user._id });

  res.send(tracks);
});

// Create tracks
router.post("/tracks", async (req, res) => {
  const { name, locations } = req.body;

  if (!name || !locations) {
    return res
      .status(422)
      .send({ error: "You must provide a name and locations" });
  }

  // since things with "await", like the save() method, can fail if given bad information, wrap in trycatch
  try {
    const track = new Track({ name, locations, userId: req.user._id });
    await track.save(); // save track to database
    res.send(track);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

module.exports = router;
