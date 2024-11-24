import express from 'express';
import * as gameController from '../controllers/gameController.js';
import * as chatController from '../controllers/chatController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/calculate-mana-cost', gameController.calculateManaCost);
router.post('/cast-spell', gameController.castSpell);
router.get('/user-mana', gameController.getUserMana);
router.post('/regenerate-mana', gameController.regenerateMana);
router.post('/chat', chatController.generateChatResponse);
router.post('/chat-image', chatController.generateImage);
router.get('/test-openai', chatController.testOpenAI);

export default router;
