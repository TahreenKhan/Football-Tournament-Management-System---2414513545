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
  fixtureController.getFixturesByTournament
);

router.patch(
  "/:fixtureId/result",
  verifyToken,
  fixtureController.submitMatchResult
);

router.get("/:fixtureId", fixtureController.getFixtureById);

module.exports = router;
