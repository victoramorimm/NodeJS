const express = require('express');

const router = express.Router();

router.get('/', (request, response) => {
    let obj = {
    };

    response.render('home', obj);
});

module.exports = router;