const User = require('../models/User');
const crypto = require('crypto');
const mailHandler = require('../handlers/mailHandler');
const { reset } = require('nodemon');

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

exports.forget = (request, response) => {
    response.render('forget');
}

exports.forgetAction = async (request, response) => {
    const user = await User.findOne({ email: request.body.email }).exec();

    if (!user) {
        request.flash('error', 'Email não cadastrado.');
        response.redirect('/users/forget');
        return;
    }

    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');

    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora.

    await user.save();

    const resetLink = `http://${request.headers.host}/users/reset/${user.resetPasswordToken}`

    const to = `${user.name} <${user.email}>`
    const html = `Testando e-mail com link: <br/> <a href="${resetLink}">Resetar Sua Senha</a>`
    const text = `Testando e-mail com link: ${resetLink}`

    mailHandler.send({
        to,
        subject: 'Resetar sua senha',
        html,
        text
    })

    request.flash('success', 'Te enviamos um e-mail com instruções.');

    response.redirect('/users/login');
}

exports.forgetToken = async (request, response) => {
    const user = await User.findOne({
        resetPasswordToken: request.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    }).exec();

    if (!user) {
        request.flash('error', 'Token expirado!');
        response.redirect('/users/forget');
        return;
    }

    response.render('forgetPassword');
}

exports.forgetTokenAction = async (request, response) => {
    const user = await User.findOne({
        resetPasswordToken: request.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    }).exec();

    if (!user) {
        request.flash('error', 'Token expirado!');
        response.redirect('/users/forget');
        return;
    }

    if (request.body.password != request.body['password-confirm']) {
        request.flash('error', 'As senhas não batem!');
        response.redirect('/back');
        return;
    } 

    user.setPassword(request.body.password, async () => {
        await user.save();

        request.flash('success', 'Senha alterada com sucesso!');

        response.redirect('/');
    })
}