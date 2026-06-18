const mongoose = require("mongoose");
const Fixture = require("../models/Fixture");
const Player = require("../models/Player");
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

const getTournamentStatistics = async (tournamentId) => {
  validateObjectId(tournamentId, "tournament id");

  const tournament = await Tournament.findById(tournamentId).populate(
    "champion",
    "teamName city coach logoUrl"
  );

  if (!tournament) {
    throw createError("Tournament not found", 404);
  }

  const registeredTeamIds = tournament.registeredTeams || [];

  const [
    totalPlayers,
    totalFixtures,
    completedFixtures,
    scheduledFixtures,
    goalStats,
  ] = await Promise.all([
    Player.countDocuments({ team: { $in: registeredTeamIds } }),
    Fixture.countDocuments({ tournament: tournamentId }),
    Fixture.countDocuments({ tournament: tournamentId, status: "COMPLETED" }),
    Fixture.countDocuments({ tournament: tournamentId, status: "SCHEDULED" }),
    Fixture.aggregate([
      {
        $match: {
          tournament: new mongoose.Types.ObjectId(tournamentId),
          status: "COMPLETED",
        },
      },
      {
        $group: {
          _id: null,
          totalGoalsScored: { $sum: { $add: ["$homeScore", "$awayScore"] } },
        },
      },
    ]),
  ]);

  const totalGoalsScored = goalStats[0]?.totalGoalsScored || 0;
  const averageGoalsPerMatch =
    completedFixtures > 0 ? totalGoalsScored / completedFixtures : 0;

  const statistics = {
    totalTeams: registeredTeamIds.length,
    totalPlayers,
    totalFixtures,
    completedFixtures,
    scheduledFixtures,
    totalGoalsScored,
    averageGoalsPerMatch,
  };

  if (tournament.status === "COMPLETED") {
    statistics.champion = tournament.champion;
  }

  return statistics;
};

module.exports = {
  getTournamentStatistics,
};
