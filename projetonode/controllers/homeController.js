exports.userInfo = (request, response, next) => {
    const userName = 'Victor';

    request.userInfo = userName;

    next();
}

exports.index = (request, response) => {
    let obj = {
    };

    const userName = request.userInfo;

    response.send(userName);
}