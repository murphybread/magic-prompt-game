const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const passport = require('passport');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/guest', authController.guestLogin);
router.get('/users', authController.getUserList);
router.delete('/delete', authMiddleware, authController.deleteUser);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  authController.socialLoginCallback
);

// Twitter OAuth routes
router.get('/twitter', (req, res, next) => {
  console.log('Starting Twitter authentication');
  passport.authenticate('twitter')(req, res, next);
});

router.get('/twitter/callback', (req, res, next) => {
  console.log('Twitter callback received');
  passport.authenticate('twitter', { failureRedirect: '/login' })(req, res, next);
}, authController.socialLoginCallback);

module.exports = router;
