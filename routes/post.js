const express = require('express');
const router = express.Router();
const PostController = require('../app/controllers/PostController');

router.get('/', PostController.index);
router.post('/', PostController.store);
router.put('/', PostController.update);
router.delete('/', PostController.destroy)
router.post('/upload', PostController.upload);
router.post('/like', PostController.like);
router.post('/get-content-by-id', PostController.getContentById);
router.get('/comment', PostController.indexComment);
router.post('/comment', PostController.storeComment);
router.delete('/comment', PostController.destroyComment);



router.get('/pagination', PostController.pagination);

module.exports = router;
