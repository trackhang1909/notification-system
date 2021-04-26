const express = require('express');
const router = express.Router();
const LoginController = require('../app/controllers/auth/LoginController');
const passport = require('passport');

router.get('/', LoginController.index);
router.post('/', LoginController.store);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login?google=fail' }),
    LoginController.store
);

module.exports = router;
