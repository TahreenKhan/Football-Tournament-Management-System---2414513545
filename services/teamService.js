const mongoose = require("mongoose");
const Team = require("../models/Team");

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const validateObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError("Invalid team id", 400);
  }
};

const createTeam = async (teamData, userId) => {
  const { teamName, city, coach, foundedYear, logoUrl } = teamData;

  if (!teamName) {
    throw createError("Team name is required", 400);
  }

  const existingTeam = await Team.findOne({
    teamName: teamName.trim(),
  });

  if (existingTeam) {
    throw createError("Team name already exists", 409);
  }

  const team = await Team.create({
    teamName: teamName.trim(),
    city,
    coach,
    foundedYear,
    logoUrl,
    createdBy: userId,
  });

  return team;
};

const getAllTeams = async () => {
  return Team.find()
    .populate("createdBy", "username email role")
    .sort({ createdAt: -1 });
};

const getTeamById = async (teamId) => {
  validateObjectId(teamId);

  const team = await Team.findById(teamId).populate(
    "createdBy",
    "username email role"
  );

  if (!team) {
    throw createError("Team not found", 404);
  }

  return team;
};

const updateTeam = async (teamId, teamData) => {
  validateObjectId(teamId);

  const allowedUpdates = ["teamName", "city", "coach", "foundedYear", "logoUrl"];
  const updates = {};

  allowedUpdates.forEach((field) => {
    if (teamData[field] !== undefined) {
      updates[field] =
        typeof teamData[field] === "string" ? teamData[field].trim() : teamData[field];
    }
  });

  if (updates.teamName === "") {
    throw createError("Team name cannot be empty", 400);
  }

  if (updates.teamName) {
    const existingTeam = await Team.findOne({
      teamName: updates.teamName,
      _id: { $ne: teamId },
    });

    if (existingTeam) {
      throw createError("Team name already exists", 409);
    }
  }

  const team = await Team.findByIdAndUpdate(teamId, updates, {
    new: true,
    runValidators: true,
  }).populate("createdBy", "username email role");

  if (!team) {
    throw createError("Team not found", 404);
  }

  return team;
};

const deleteTeam = async (teamId) => {
  validateObjectId(teamId);

  const team = await Team.findByIdAndDelete(teamId);

  if (!team) {
    throw createError("Team not found", 404);
  }

  return team;
};

module.exports = {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
};
