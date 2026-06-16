const express = require("express");
const registrationController = require("../controllers/registrationController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router({ mergeParams: true });

router.post(
  "/:tournamentId/register/:teamId",
  verifyToken,
  registrationController.registerTeamToTournament
);

router.delete(
  "/:tournamentId/register/:teamId",
  verifyToken,
  registrationController.removeTeamFromTournament
);

router.get(
  "/:tournamentId/teams",
  verifyToken,
  registrationController.getRegisteredTeams
);

module.exports = router;
