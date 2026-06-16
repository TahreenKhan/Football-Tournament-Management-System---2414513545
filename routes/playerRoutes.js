const express = require("express");
const playerController = require("../controllers/playerController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", verifyToken, playerController.createPlayer);
router.get("/", playerController.getAllPlayers);
router.get("/team/:teamId", playerController.getPlayersByTeam);
router.get("/:id", playerController.getPlayerById);
router.put("/:id", verifyToken, playerController.updatePlayer);
router.delete("/:id", verifyToken, playerController.deletePlayer);

module.exports = router;
