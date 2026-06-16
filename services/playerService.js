const mongoose = require("mongoose");
const Player = require("../models/Player");
const Team = require("../models/Team");

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const validateObjectId = (id, fieldName) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(`Invalid ${fieldName}`, 400);
  }
};

const validateTeamExists = async (teamId) => {
  if (!teamId) {
    return;
  }

  validateObjectId(teamId, "team id");

  const team = await Team.findById(teamId);

  if (!team) {
    throw createError("Team not found", 404);
  }
};

const populateTeam = (query) =>
  query.populate("team", "teamName city coach logoUrl foundedYear");

const createPlayer = async (playerData) => {
  const { firstName, lastName, jerseyNumber, age, nationality, position, team } =
    playerData;

  if (!firstName || !lastName || jerseyNumber === undefined) {
    throw createError("First name, last name, and jersey number are required", 400);
  }

  await validateTeamExists(team);

  const player = await Player.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    jerseyNumber,
    age,
    nationality,
    position,
    team,
  });

  return populateTeam(Player.findById(player._id));
};

const getAllPlayers = async () => {
  return populateTeam(Player.find()).sort({ createdAt: -1 });
};

const getPlayerById = async (playerId) => {
  validateObjectId(playerId, "player id");

  const player = await populateTeam(Player.findById(playerId));

  if (!player) {
    throw createError("Player not found", 404);
  }

  return player;
};

const updatePlayer = async (playerId, playerData) => {
  validateObjectId(playerId, "player id");

  if (playerData.team !== undefined && playerData.team !== null && playerData.team !== "") {
    await validateTeamExists(playerData.team);
  }

  const allowedUpdates = [
    "firstName",
    "lastName",
    "jerseyNumber",
    "age",
    "nationality",
    "position",
    "team",
  ];
  const updates = {};

  allowedUpdates.forEach((field) => {
    if (playerData[field] !== undefined) {
      updates[field] =
        typeof playerData[field] === "string"
          ? playerData[field].trim()
          : playerData[field];
    }
  });

  if (updates.firstName === "" || updates.lastName === "") {
    throw createError("First name and last name cannot be empty", 400);
  }

  if (updates.team === "" || updates.team === null) {
    updates.team = null;
  }

  const player = await populateTeam(
    Player.findByIdAndUpdate(playerId, updates, {
      new: true,
      runValidators: true,
    })
  );

  if (!player) {
    throw createError("Player not found", 404);
  }

  return player;
};

const deletePlayer = async (playerId) => {
  validateObjectId(playerId, "player id");

  const player = await Player.findByIdAndDelete(playerId);

  if (!player) {
    throw createError("Player not found", 404);
  }

  return player;
};

const getPlayersByTeam = async (teamId) => {
  validateObjectId(teamId, "team id");

  const team = await Team.findById(teamId);

  if (!team) {
    throw createError("Team not found", 404);
  }

  return populateTeam(Player.find({ team: teamId })).sort({ jerseyNumber: 1 });
};

module.exports = {
  createPlayer,
  getAllPlayers,
  getPlayerById,
  updatePlayer,
  deletePlayer,
  getPlayersByTeam,
};
