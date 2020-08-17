const mongoose = require('mongoose');
const Post = mongoose.model('Post');

exports.add = (request, response) => {
    response.render('postAdd');
}

exports.addAction = async (request, response) => {
    const post = new Post(request.body);
    
    try {
        await post.save();
    } catch (error) {
        request.flash('error', 'Ocorreu um erro! Tente novamente mais tarde');
    }

    request.flash('success', 'Post salvo com sucesso!');

    response.redirect('/');
} 