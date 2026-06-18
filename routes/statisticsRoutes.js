const express = require("express");
const statisticsController = require("../controllers/statisticsController");

const router = express.Router();

router.get(
  "/tournament/:tournamentId",
  statisticsController.getTournamentStatistics
);

module.exports = router;
