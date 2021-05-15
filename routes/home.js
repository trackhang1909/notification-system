const express = require('express');
const router = express.Router();
const HomeController = require('../app/controllers/HomeController');

router.get('/', HomeController.index);
router.get('/my-profile', HomeController.myProfile);

module.exports = router;
