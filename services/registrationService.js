const mongoose = require("mongoose");
const Team = require("../models/Team");
const Tournament = require("../models/Tournament");

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

const getTournamentOrFail = async (tournamentId) => {
  validateObjectId(tournamentId, "tournament id");

  const tournament = await Tournament.findById(tournamentId);

  if (!tournament) {
    throw createError("Tournament not found", 404);
  }

  return tournament;
};

const getTeamOrFail = async (teamId) => {
  validateObjectId(teamId, "team id");

  const team = await Team.findById(teamId);

  if (!team) {
    throw createError("Team not found", 404);
  }

  return team;
};

const ensureRegistrationIsOpen = (tournament) => {
  if (!["DRAFT", "REGISTRATION_OPEN"].includes(tournament.status)) {
    throw createError("Tournament registration is closed", 400);
  }
};

const populateRegisteredTeams = (query) =>
  query.populate("registeredTeams", "teamName city coach foundedYear logoUrl");

const registerTeamToTournament = async (tournamentId, teamId) => {
  const tournament = await getTournamentOrFail(tournamentId);
  await getTeamOrFail(teamId);

  ensureRegistrationIsOpen(tournament);

  const isAlreadyRegistered = tournament.registeredTeams.some(
    (registeredTeamId) => registeredTeamId.toString() === teamId
  );

  if (isAlreadyRegistered) {
    throw createError("Team is already registered in this tournament", 409);
  }

  if (
    tournament.maxTeams &&
    tournament.registeredTeams.length >= tournament.maxTeams
  ) {
    throw createError("Tournament is full. Maximum team limit reached", 400);
  }

  tournament.registeredTeams.push(teamId);
  await tournament.save();

  return populateRegisteredTeams(Tournament.findById(tournamentId));
};

const removeTeamFromTournament = async (tournamentId, teamId) => {
  const tournament = await getTournamentOrFail(tournamentId);
  await getTeamOrFail(teamId);

  const initialCount = tournament.registeredTeams.length;

  tournament.registeredTeams = tournament.registeredTeams.filter(
    (registeredTeamId) => registeredTeamId.toString() !== teamId
  );

  if (tournament.registeredTeams.length === initialCount) {
    throw createError("Team is not registered in this tournament", 404);
  }

  await tournament.save();

  return populateRegisteredTeams(Tournament.findById(tournamentId));
};

const getRegisteredTeams = async (tournamentId) => {
  validateObjectId(tournamentId, "tournament id");

  const tournament = await populateRegisteredTeams(
    Tournament.findById(tournamentId)
  );

  if (!tournament) {
    throw createError("Tournament not found", 404);
  }

  return tournament.registeredTeams;
};

const getTournamentRegistrations = async (tournamentId) => {
  validateObjectId(tournamentId, "tournament id");

  const tournament = await populateRegisteredTeams(
    Tournament.findById(tournamentId)
  ).populate("createdBy", "username email role");

  if (!tournament) {
    throw createError("Tournament not found", 404);
  }

  return {
    tournament,
    registeredTeams: tournament.registeredTeams,
    registeredCount: tournament.registeredTeams.length,
    maxTeams: tournament.maxTeams,
  };
};

module.exports = {
  registerTeamToTournament,
  removeTeamFromTournament,
  getRegisteredTeams,
  getTournamentRegistrations,
};
