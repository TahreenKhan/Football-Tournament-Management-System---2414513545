const fixtureService = require("../services/fixtureService");

const generateKnockoutFixtures = async (req, res) => {
  try {
    const fixtures = await fixtureService.generateKnockoutFixtures(
      req.params.tournamentId
    );

    res.status(201).json({
      success: true,
      message: "Knockout fixtures generated successfully",
      count: fixtures.length,
      data: fixtures,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to generate fixtures",
    });
  }
};

const getFixturesByTournament = async (req, res) => {
  try {
    const fixtures = await fixtureService.getFixturesByTournament(
      req.params.tournamentId
    );

    res.status(200).json({
      success: true,
      count: fixtures.length,
      data: fixtures,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch fixtures",
    });
  }
};

module.exports = {
  generateKnockoutFixtures,
  getFixturesByTournament,
};
