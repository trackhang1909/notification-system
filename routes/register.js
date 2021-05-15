const express = require('express');
const router = express.Router();
const RegisterController = require('../app/controllers/auth/RegisterController');

router.get('/', RegisterController.index);
router.post('/', RegisterController.store);
router.get('/update-categories', RegisterController.indexUpdateCategories);
router.post('/update-categories', RegisterController.updateCategories);
router.post('/get-categories', RegisterController.getCategories);

module.exports = router;