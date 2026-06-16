const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tournament name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    tournamentType: {
      type: String,
      enum: ["KNOCKOUT", "ROUND_ROBIN", "GROUP_STAGE"],
      required: [true, "Tournament type is required"],
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    maxTeams: {
      type: Number,
      min: [2, "Maximum teams must be at least 2"],
    },
    status: {
      type: String,
      enum: [
        "DRAFT",
        "REGISTRATION_OPEN",
        "REGISTRATION_CLOSED",
        "IN_PROGRESS",
        "COMPLETED",
      ],
      default: "DRAFT",
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

module.exports = mongoose.model("Tournament", tournamentSchema);
