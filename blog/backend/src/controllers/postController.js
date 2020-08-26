const mongoose = require('mongoose');

const Post = mongoose.model('Post');

exports.add = async (request, response) => {
    const post = new Post(request.body);

    try {
        await post.save();
        console.log('Post criado com sucesso!');
    } catch (error) {
        console.log('Ocorreu um erro!');
    }

    return response.json(post);
}