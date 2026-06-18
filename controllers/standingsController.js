const standingsService = require("../services/standingsService");

const getTournamentStandings = async (req, res) => {
  try {
    const standings = await standingsService.getTournamentStandings(
      req.params.tournamentId
    );

    res.status(200).json({
      success: true,
      count: standings.length,
      data: standings,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch standings",
    });
  }
};

module.exports = {
  getTournamentStandings,
};
