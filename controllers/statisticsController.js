const statisticsService = require("../services/statisticsService");

const getTournamentStatistics = async (req, res) => {
  try {
    const statistics = await statisticsService.getTournamentStatistics(
      req.params.tournamentId
    );

    res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch statistics",
    });
  }
};

module.exports = {
  getTournamentStatistics,
};
