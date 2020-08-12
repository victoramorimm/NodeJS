const express = require('express');

const router = express.Router();

router.get('/', (request, response) => {
    response.render('home', {
        name: request.query.name,
        age: request.query.age,
        mostrar: true,
        ingredientes : [
            { nome: 'Arroz', qt: '20g' },
            { nome: 'Macarrão', qt: '40g' }
        ],
        interesses: ['NodeJS', 'React Native', 'ReactJS'],
        teste: '<strong>Testando</strong> '
    });
});

module.exports = router;