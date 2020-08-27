const express = require('express');

const postController = require('../controllers/postController');
const homeController = require('../controllers/homeController');

const router = express.Router();

router.get('/', homeController.listPosts);

router.post('/posts', postController.add);

router.put('/posts/:id/edit', postController.edit);

router.get('/posts/:id', postController.viewPost);

module.exports = router;