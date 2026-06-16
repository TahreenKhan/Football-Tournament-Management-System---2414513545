const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    jerseyNumber: {
      type: Number,
      required: [true, "Jersey number is required"],
      min: [1, "Jersey number must be at least 1"],
    },
    age: {
      type: Number,
      min: [1, "Age must be at least 1"],
    },
    nationality: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      enum: ["GOALKEEPER", "DEFENDER", "MIDFIELDER", "FORWARD"],
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Player", playerSchema);
