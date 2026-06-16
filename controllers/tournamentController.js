const tournamentService = require("../services/tournamentService");

const createTournament = async (req, res) => {
  try {
    const tournament = await tournamentService.createTournament(
      req.body,
      req.user._id
    );

    res.status(201).json({
      success: true,
      message: "Tournament created successfully",
      data: tournament,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create tournament",
    });
  }
};

const getAllTournaments = async (req, res) => {
  try {
    const tournaments = await tournamentService.getAllTournaments();

    res.status(200).json({
      success: true,
      count: tournaments.length,
      data: tournaments,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch tournaments",
    });
  }
};

const getTournamentById = async (req, res) => {
  try {
    const tournament = await tournamentService.getTournamentById(req.params.id);

    res.status(200).json({
      success: true,
      data: tournament,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch tournament",
    });
  }
};

const updateTournament = async (req, res) => {
  try {
    const tournament = await tournamentService.updateTournament(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Tournament updated successfully",
      data: tournament,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update tournament",
    });
  }
};

const deleteTournament = async (req, res) => {
  try {
    await tournamentService.deleteTournament(req.params.id);

    res.status(200).json({
      success: true,
      message: "Tournament deleted successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to delete tournament",
    });
  }
};

module.exports = {
  createTournament,
  getAllTournaments,
  getTournamentById,
  updateTournament,
  deleteTournament,
};
