const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/guest', authController.guestLogin);
router.get('/users', authController.getUserList);
router.delete('/delete', authMiddleware, authController.deleteUser);

module.exports = router;
