const mongoose = require("mongoose");
const Fixture = require("../models/Fixture");
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

const populateFixtureTeams = (query) =>
  query
    .populate("tournament", "name tournamentType status")
    .populate("homeTeam", "teamName city coach logoUrl")
    .populate("awayTeam", "teamName city coach logoUrl")
    .populate("winner", "teamName city coach logoUrl");

const generateKnockoutFixtures = async (tournamentId) => {
  validateObjectId(tournamentId, "tournament id");

  const tournament = await Tournament.findById(tournamentId).populate(
    "registeredTeams",
    "teamName city coach logoUrl"
  );

  if (!tournament) {
    throw createError("Tournament not found", 404);
  }

  if (tournament.tournamentType !== "KNOCKOUT") {
    throw createError("Fixtures can only be generated for knockout tournaments", 400);
  }

  const fixturesAlreadyExist = await Fixture.exists({ tournament: tournamentId });

  if (fixturesAlreadyExist) {
    throw createError("Fixtures already generated for this tournament", 409);
  }

  if (!tournament.registeredTeams || tournament.registeredTeams.length === 0) {
    throw createError("Tournament must have registered teams", 400);
  }

  if (tournament.registeredTeams.length < 2) {
    throw createError("Minimum 2 teams required", 400);
  }

  if (tournament.registeredTeams.length % 2 !== 0) {
    throw createError("Even number of teams required to generate knockout fixtures", 400);
  }

  const fixtures = [];

  for (let index = 0; index < tournament.registeredTeams.length; index += 2) {
    fixtures.push({
      tournament: tournament._id,
      round: 1,
      homeTeam: tournament.registeredTeams[index]._id,
      awayTeam: tournament.registeredTeams[index + 1]._id,
      status: "SCHEDULED",
    });
  }

  const createdFixtures = await Fixture.insertMany(fixtures);
  const fixtureIds = createdFixtures.map((fixture) => fixture._id);

  return populateFixtureTeams(Fixture.find({ _id: { $in: fixtureIds } })).sort({
    createdAt: 1,
  });
};

const getFixtureById = async (fixtureId) => {
  validateObjectId(fixtureId, "fixture id");

  const fixture = await populateFixtureTeams(Fixture.findById(fixtureId));

  if (!fixture) {
    throw createError("Fixture not found", 404);
  }

  return fixture;
};

const getTournamentFixtures = async (tournamentId) => {
  validateObjectId(tournamentId, "tournament id");

  const tournament = await Tournament.findById(tournamentId);

  if (!tournament) {
    throw createError("Tournament not found", 404);
  }

  return populateFixtureTeams(Fixture.find({ tournament: tournamentId })).sort({
    round: 1,
    createdAt: 1,
  });
};

const submitMatchResult = async (fixtureId, resultData) => {
  validateObjectId(fixtureId, "fixture id");

  const fixture = await Fixture.findById(fixtureId).populate(
    "tournament",
    "name tournamentType status"
  );

  if (!fixture) {
    throw createError("Fixture not found", 404);
  }

  if (fixture.status === "COMPLETED") {
    throw createError("Match result already submitted", 400);
  }

  const homeScore = Number(resultData.homeScore);
  const awayScore = Number(resultData.awayScore);

  if (!Number.isInteger(homeScore) || !Number.isInteger(awayScore)) {
    throw createError("Home score and away score must be valid numbers", 400);
  }

  if (homeScore < 0 || awayScore < 0) {
    throw createError("Scores cannot be negative", 400);
  }

  if (
    fixture.tournament.tournamentType === "KNOCKOUT" &&
    homeScore === awayScore
  ) {
    throw createError("Knockout matches cannot end in a draw", 400);
  }

  let winner = null;

  if (homeScore > awayScore) {
    winner = fixture.homeTeam;
  }

  if (awayScore > homeScore) {
    winner = fixture.awayTeam;
  }

  fixture.homeScore = homeScore;
  fixture.awayScore = awayScore;
  fixture.winner = winner;
  fixture.status = "COMPLETED";
  fixture.playedAt = new Date();

  await fixture.save();

  return getFixtureById(fixture._id);
};

module.exports = {
  generateKnockoutFixtures,
  submitMatchResult,
  getFixtureById,
  getTournamentFixtures,
  getFixturesByTournament: getTournamentFixtures,
};
