const playerService = require("../services/playerService");

const createPlayer = async (req, res) => {
  try {
    const player = await playerService.createPlayer(req.body);

    res.status(201).json({
      success: true,
      message: "Player created successfully",
      data: player,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create player",
    });
  }
};

const getAllPlayers = async (req, res) => {
  try {
    const players = await playerService.getAllPlayers();

    res.status(200).json({
      success: true,
      count: players.length,
      data: players,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch players",
    });
  }
};

const getPlayerById = async (req, res) => {
  try {
    const player = await playerService.getPlayerById(req.params.id);

    res.status(200).json({
      success: true,
      data: player,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch player",
    });
  }
};

const updatePlayer = async (req, res) => {
  try {
    const player = await playerService.updatePlayer(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Player updated successfully",
      data: player,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update player",
    });
  }
};

const deletePlayer = async (req, res) => {
  try {
    await playerService.deletePlayer(req.params.id);

    res.status(200).json({
      success: true,
      message: "Player deleted successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to delete player",
    });
  }
};

const getPlayersByTeam = async (req, res) => {
  try {
    const players = await playerService.getPlayersByTeam(req.params.teamId);

    res.status(200).json({
      success: true,
      count: players.length,
      data: players,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch team players",
    });
  }
};

module.exports = {
  createPlayer,
  getAllPlayers,
  getPlayerById,
  updatePlayer,
  deletePlayer,
  getPlayersByTeam,
};
