const express = require('express');

const router = express.Router();

router.get('/', (request, response) => {
    response.send('Página principal');
});

router.get('/sobre', (request, response) => {
    response.send('Página sobre');
});

module.exports = router;