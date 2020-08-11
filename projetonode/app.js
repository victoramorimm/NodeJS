const express = require('express');

const router = express.Router();

router.get('/', (request, response) => {
    response.send('Hello Pepeu');
});

const app = express();

app.use('/', router);

module.exports = app;