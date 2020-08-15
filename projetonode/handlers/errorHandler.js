exports.notFound = (request, response, next) => {
    response.status = 400;

    response.render('404');
}