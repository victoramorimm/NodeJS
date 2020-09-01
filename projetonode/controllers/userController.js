const User = require('../models/User');

exports.login = (request, response) => {
    response.render('login');
}

exports.register = (request, response) => {
    response.render('register');
}

exports.registerAction = (request, response) => {
    const newUser = new User(request.body);
    
    const { password } = request.body

    User.register(newUser, password, (error) => {
        if (error) {
            console.log('Erro: ' + error);
            response.redirect('/');
            return;
        }

        response.redirect('/');
    });
}