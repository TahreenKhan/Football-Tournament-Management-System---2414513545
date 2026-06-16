const express = require("express");
const fixtureController = require("../controllers/fixtureController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/generate/:tournamentId",
  verifyToken,
  fixtureController.generateKnockoutFixtures
);

router.get(
  "/tournament/:tournamentId",
  verifyToken,
  fixtureController.getFixturesByTournament
);

module.exports = router;
