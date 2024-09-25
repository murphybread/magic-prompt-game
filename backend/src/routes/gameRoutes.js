const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/calculate-mana-cost', gameController.calculateManaCost);
router.post('/cast-spell', gameController.castSpell);

module.exports = router;
