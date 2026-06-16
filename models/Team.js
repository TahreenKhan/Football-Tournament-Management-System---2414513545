const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: [true, "Team name is required"],
      unique: true,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    coach: {
      type: String,
      trim: true,
    },
    foundedYear: {
      type: Number,
      min: [1800, "Founded year is invalid"],
      max: [new Date().getFullYear(), "Founded year cannot be in the future"],
    },
    logoUrl: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Team", teamSchema);
