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

const createStandingRow = (team) => ({
  team,
  played: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  goalDifference: 0,
  points: 0,
});

const updateGoalDifference = (standing) => {
  standing.goalDifference = standing.goalsFor - standing.goalsAgainst;
};

const getTournamentStandings = async (tournamentId) => {
  validateObjectId(tournamentId, "tournament id");

  const tournament = await Tournament.findById(tournamentId);

  if (!tournament) {
    throw createError("Tournament not found", 404);
  }

  const fixtures = await Fixture.find({
    tournament: tournamentId,
    status: "COMPLETED",
  })
    .populate("homeTeam", "teamName city coach logoUrl")
    .populate("awayTeam", "teamName city coach logoUrl");

  const standingsMap = new Map();

  fixtures.forEach((fixture) => {
    const homeTeamId = fixture.homeTeam._id.toString();
    const awayTeamId = fixture.awayTeam._id.toString();

    if (!standingsMap.has(homeTeamId)) {
      standingsMap.set(homeTeamId, createStandingRow(fixture.homeTeam));
    }

    if (!standingsMap.has(awayTeamId)) {
      standingsMap.set(awayTeamId, createStandingRow(fixture.awayTeam));
    }

    const homeStanding = standingsMap.get(homeTeamId);
    const awayStanding = standingsMap.get(awayTeamId);

    homeStanding.played += 1;
    awayStanding.played += 1;

    homeStanding.goalsFor += fixture.homeScore;
    homeStanding.goalsAgainst += fixture.awayScore;
    awayStanding.goalsFor += fixture.awayScore;
    awayStanding.goalsAgainst += fixture.homeScore;

    if (fixture.homeScore > fixture.awayScore) {
      homeStanding.wins += 1;
      homeStanding.points += 3;
      awayStanding.losses += 1;
    } else if (fixture.awayScore > fixture.homeScore) {
      awayStanding.wins += 1;
      awayStanding.points += 3;
      homeStanding.losses += 1;
    } else {
      homeStanding.draws += 1;
      awayStanding.draws += 1;
      homeStanding.points += 1;
      awayStanding.points += 1;
    }

    updateGoalDifference(homeStanding);
    updateGoalDifference(awayStanding);
  });

  return Array.from(standingsMap.values()).sort((teamA, teamB) => {
    if (teamB.points !== teamA.points) {
      return teamB.points - teamA.points;
    }

    if (teamB.goalDifference !== teamA.goalDifference) {
      return teamB.goalDifference - teamA.goalDifference;
    }

    return teamB.goalsFor - teamA.goalsFor;
  });
};

module.exports = {
  getTournamentStandings,
};
