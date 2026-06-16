const teamService = require("../services/teamService");

const createTeam = async (req, res) => {
  try {
    const team = await teamService.createTeam(req.body, req.user._id);

    res.status(201).json({
      success: true,
      message: "Team created successfully",
      data: team,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create team",
    });
  }
};

const getAllTeams = async (req, res) => {
  try {
    const teams = await teamService.getAllTeams();

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch teams",
    });
  }
};

const getTeamById = async (req, res) => {
  try {
    const team = await teamService.getTeamById(req.params.id);

    res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch team",
    });
  }
};

const updateTeam = async (req, res) => {
  try {
    const team = await teamService.updateTeam(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Team updated successfully",
      data: team,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update team",
    });
  }
};

const deleteTeam = async (req, res) => {
  try {
    await teamService.deleteTeam(req.params.id);

    res.status(200).json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to delete team",
    });
  }
};

module.exports = {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
};
