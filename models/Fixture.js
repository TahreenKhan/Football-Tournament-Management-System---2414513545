const mongoose = require("mongoose");

const fixtureSchema = new mongoose.Schema(
  {
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    round: {
      type: Number,
      required: true,
      default: 1,
    },
    homeTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    awayTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
    homeScore: {
      type: Number,
      default: 0,
      min: [0, "Home score cannot be negative"],
    },
    awayScore: {
      type: Number,
      default: 0,
      min: [0, "Away score cannot be negative"],
    },
    playedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["SCHEDULED", "COMPLETED"],
      default: "SCHEDULED",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Fixture", fixtureSchema);
