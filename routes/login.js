const express = require('express');
const router = express.Router();
const LoginController = require('../app/controllers/auth/LoginController');

router.get('/', LoginController.index);
router.post('/', LoginController.store);

module.exports = router;
