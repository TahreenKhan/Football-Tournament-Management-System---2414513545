const express = require("express");
const tournamentController = require("../controllers/tournamentController");
const registrationRoutes = require("./registrationRoutes");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.use("/", registrationRoutes);
router.post("/", verifyToken, tournamentController.createTournament);
router.get("/", tournamentController.getAllTournaments);
router.get("/:id", tournamentController.getTournamentById);
router.put("/:id", verifyToken, tournamentController.updateTournament);
router.delete("/:id", verifyToken, tournamentController.deleteTournament);

module.exports = router;
