exports.index = (request, response) => {
    let obj = {
    };

    const userName = request.userInfo;

    response.send(userName);
}