const express = require("express");
const teamController = require("../controllers/teamController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", verifyToken, teamController.createTeam);
router.get("/", teamController.getAllTeams);
router.get("/:id", teamController.getTeamById);
router.put("/:id", verifyToken, teamController.updateTeam);
router.delete("/:id", verifyToken, teamController.deleteTeam);

module.exports = router;
