const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/calculate-mana-cost', gameController.calculateManaCost);
router.post('/cast-spell', gameController.castSpell);
router.get('/user-mana', gameController.getUserMana);
router.post('/chat', chatController.generateChatResponse);
router.get('/test-openai', chatController.testOpenAI);

module.exports = router;
