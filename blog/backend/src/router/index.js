const express = require('express');

const postController = require('../controllers/postController');

const router = express.Router();

router.get('/', (request, response) => {
    response.json({ message: 'Hello World' });
})

router.post('/posts', postController.add);

module.exports = router;