const registrationService = require("../services/registrationService");

const registerTeamToTournament = async (req, res) => {
  try {
    const tournament = await registrationService.registerTeamToTournament(
      req.params.tournamentId,
      req.params.teamId
    );

    res.status(200).json({
      success: true,
      message: "Team registered to tournament successfully",
      data: tournament,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeTeamFromTournament = async (req, res) => {
  try {
    const tournament = await registrationService.removeTeamFromTournament(
      req.params.tournamentId,
      req.params.teamId
    );

    res.status(200).json({
      success: true,
      message: "Team removed from tournament successfully",
      data: tournament,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getRegisteredTeams = async (req, res) => {
  try {
    const teams = await registrationService.getRegisteredTeams(
      req.params.tournamentId
    );

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTournamentRegistrations = async (req, res) => {
  try {
    const registrations = await registrationService.getTournamentRegistrations(
      req.params.tournamentId
    );

    res.status(200).json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerTeamToTournament,
  removeTeamFromTournament,
  getRegisteredTeams,
  getTournamentRegistrations,
};
