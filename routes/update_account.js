const express = require('express');
const router = express.Router();
const UpdateAccountController = require('../app/controllers/auth/UpdateAccountController');

router.get('/', UpdateAccountController.updateAccountView);
router.post('/upload-avatar', UpdateAccountController.uploadAvatar);
router.post('/student', UpdateAccountController.updateAccountStudent);
router.post('/faculty', UpdateAccountController.updateAccountFaculty);

module.exports = router;