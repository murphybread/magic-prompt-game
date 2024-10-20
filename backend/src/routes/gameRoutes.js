const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/calculate-mana-cost', gameController.calculateManaCost);
router.post('/cast-spell', gameController.castSpell);
router.get('/user-mana', gameController.getUserMana);
router.post('/regenerate-mana', gameController.regenerateMana);
router.post('/chat', chatController.generateChatResponse);
router.post('/chat-image', chatController.generateImage);
router.get('/test-openai', chatController.testOpenAI);

module.exports = router;
