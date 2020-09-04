module.exports.isLogged = (request, response, next) => {
    if (!request.isAuthenticated()) {
        request.flash('error', 'Ops! Você não tem permissão para acessar esta página.');
        response.redirect('/users/login');
    }
    
    next();
}