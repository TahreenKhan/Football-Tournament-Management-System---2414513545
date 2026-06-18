const express = require("express");
const standingsController = require("../controllers/standingsController");

const router = express.Router();

router.get("/:tournamentId", standingsController.getTournamentStandings);

module.exports = router;
