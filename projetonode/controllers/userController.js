const User = require('../models/User');
const { request, response } = require('express');

exports.login = (request, response) => {
    response.render('login');
}

exports.loginAction = (request, response) => {
    const auth = User.authenticate();

    const { email, password } = request.body

    auth(email, password, (error, result) => {
        if (!result) {
            request.flash('error','Seu e-mail e/ou senha estão errados!');
            response.redirect('/users/login');
            return;
        }

        request.login(result, () => {});

        request.flash('success', 'Você foi logado com sucesso!');

        response.redirect('/');
    })
}

exports.register = (request, response) => {
    response.render('register');
}
 
exports.registerAction = (request, response) => {
    const newUser = new User(request.body);
    
    const { password } = request.body

    User.register(newUser, password, (error) => {
        if (error) {
            request.flash('error', 'Ocorreu um erro, tente novamente mais tarde.');
            response.redirect('/users/register');
            return;
        }
        request.flash('success', 'Registro efetuado com sucesso. Faça o login!');
        response.redirect('/users/login');
    });
}

exports.logout = (request, response) => {
    request.logout();
    response.redirect('/');
}

exports.profile = (request, response) => {
    response.render('profile');
}

exports.profileAction = async (request, response) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: request.user._id },
            { name: request.body.name, email: request.body.email },
            { new: true, runValidators: true }
        )
    } catch (error) {
        request.flash('error', 'Erro: ' + error.message);
        response.redirect('/profile');
        return;
    }

    request.flash('success', 'Dados atualizados com sucesso!');
    response.redirect('/profile');
}