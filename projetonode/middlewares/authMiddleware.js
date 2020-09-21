exports.isLogged = (request, response, next) => {
    if (!request.isAuthenticated()) {
        request.flash('error', 'Ops! Você não tem permissão para acessar esta página.');
        response.redirect('/users/login');
    }
    
    next();
}

exports.changePassword = (request, response) => {
    if (request.body.password != request.body['password-confirm']) {
        request.flash('error', 'As senhas não batem!');
        response.redirect('/profile');
        return;
    } 

    request.user.setPassword(request.body.password, async () => {
        await request.user.save();

        request.flash('success', 'Senha alterada com sucesso!');

        response.redirect('/');
    })
}