const mongoose = require("mongoose");
const Tournament = require("../models/Tournament");

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const validateObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError("Invalid tournament id", 400);
  }
};

const validateDates = (startDate, endDate) => {
  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    throw createError("End date cannot be before start date", 400);
  }
};

const validateEnums = ({ tournamentType, status }) => {
  const tournamentTypes = ["KNOCKOUT", "ROUND_ROBIN", "GROUP_STAGE"];
  const statuses = [
    "DRAFT",
    "REGISTRATION_OPEN",
    "REGISTRATION_CLOSED",
    "IN_PROGRESS",
    "COMPLETED",
  ];

  if (tournamentType && !tournamentTypes.includes(tournamentType)) {
    throw createError("Invalid tournament type", 400);
  }

  if (status && !statuses.includes(status)) {
    throw createError("Invalid tournament status", 400);
  }
};

const populateCreatedBy = (query) =>
  query.populate("createdBy", "username email role");

const createTournament = async (tournamentData, userId) => {
  const {
    name,
    description,
    tournamentType,
    startDate,
    endDate,
    maxTeams,
    status,
  } = tournamentData;

  if (!name || !tournamentType) {
    throw createError("Tournament name and type are required", 400);
  }

  validateEnums({ tournamentType, status });
  validateDates(startDate, endDate);

  const existingTournament = await Tournament.findOne({ name: name.trim() });

  if (existingTournament) {
    throw createError("Tournament name already exists", 409);
  }

  const tournament = await Tournament.create({
    name: name.trim(),
    description,
    tournamentType,
    startDate,
    endDate,
    maxTeams,
    status,
    createdBy: userId,
  });

  return populateCreatedBy(Tournament.findById(tournament._id));
};

const getAllTournaments = async () => {
  return populateCreatedBy(Tournament.find()).sort({ createdAt: -1 });
};

const getTournamentById = async (tournamentId) => {
  validateObjectId(tournamentId);

  const tournament = await populateCreatedBy(Tournament.findById(tournamentId));

  if (!tournament) {
    throw createError("Tournament not found", 404);
  }

  return tournament;
};

const updateTournament = async (tournamentId, tournamentData) => {
  validateObjectId(tournamentId);

  validateEnums(tournamentData);

  const allowedUpdates = [
    "name",
    "description",
    "tournamentType",
    "startDate",
    "endDate",
    "maxTeams",
    "status",
  ];
  const updates = {};

  allowedUpdates.forEach((field) => {
    if (tournamentData[field] !== undefined) {
      updates[field] =
        typeof tournamentData[field] === "string"
          ? tournamentData[field].trim()
          : tournamentData[field];
    }
  });

  if (updates.name === "") {
    throw createError("Tournament name cannot be empty", 400);
  }

  const currentTournament = await Tournament.findById(tournamentId);

  if (!currentTournament) {
    throw createError("Tournament not found", 404);
  }

  validateDates(
    updates.startDate !== undefined ? updates.startDate : currentTournament.startDate,
    updates.endDate !== undefined ? updates.endDate : currentTournament.endDate
  );

  if (updates.name) {
    const existingTournament = await Tournament.findOne({
      name: updates.name,
      _id: { $ne: tournamentId },
    });

    if (existingTournament) {
      throw createError("Tournament name already exists", 409);
    }
  }

  const tournament = await populateCreatedBy(
    Tournament.findByIdAndUpdate(tournamentId, updates, {
      new: true,
      runValidators: true,
    })
  );

  return tournament;
};

const deleteTournament = async (tournamentId) => {
  validateObjectId(tournamentId);

  const tournament = await Tournament.findByIdAndDelete(tournamentId);

  if (!tournament) {
    throw createError("Tournament not found", 404);
  }

  return tournament;
};

module.exports = {
  createTournament,
  getAllTournaments,
  getTournamentById,
  updateTournament,
  deleteTournament,
};
