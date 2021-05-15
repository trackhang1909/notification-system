const express = require('express');
const router = express.Router();
const NotificationController = require('../app/controllers/NotificationController');

router.get('/', NotificationController.index);
router.post('/', NotificationController.store);
router.put('/', NotificationController.update);
router.delete('/', NotificationController.destroy);
router.get('/table', NotificationController.getNotification);
router.get('/detail', NotificationController.detail);
router.get('/detail-content', NotificationController.detailContent);
router.post('/upload-files', NotificationController.uploadFiles);
router.post('/get-content-by-id', NotificationController.getContentById);
router.post('/delete-file', NotificationController.deleteFile);

module.exports = router;
