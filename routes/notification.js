const express = require('express');
const router = express.Router();
const NotificationController = require('../app/controllers/NotificationController');

router.get('/', NotificationController.index);

module.exports = router;
