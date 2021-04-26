const express = require('express');
const router = express.Router();
const RegisterController = require('../app/controllers/auth/RegisterController');

router.get('/', RegisterController.index);
router.post('/', RegisterController.store);

module.exports = router;