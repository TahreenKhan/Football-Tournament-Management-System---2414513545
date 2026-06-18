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
    const fixtures = await fixtureService.getTournamentFixtures(
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

const generateNextRound = async (req, res) => {
  try {
    const result = await fixtureService.generateNextRound(
      req.params.tournamentId
    );

    if (result.championDeclared) {
      return res.status(200).json({
        success: true,
        message: "Tournament champion declared",
        data: result,
      });
    }

    res.status(201).json({
      success: true,
      message: "Next round fixtures generated successfully",
      count: result.length,
      data: result,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to generate next round",
    });
  }
};

const getFixtureById = async (req, res) => {
  try {
    const fixture = await fixtureService.getFixtureById(req.params.fixtureId);

    res.status(200).json({
      success: true,
      data: fixture,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch fixture",
    });
  }
};

const submitMatchResult = async (req, res) => {
  try {
    const fixture = await fixtureService.submitMatchResult(
      req.params.fixtureId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Match result submitted successfully",
      data: fixture,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to submit match result",
    });
  }
};

module.exports = {
  generateKnockoutFixtures,
  generateNextRound,
  getFixturesByTournament,
  getFixtureById,
  submitMatchResult,
};
