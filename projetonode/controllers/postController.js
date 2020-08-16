const mongoose = require('mongoose');
const Post = mongoose.model('Post');

exports.add = (request, response) => {
    response.render('postAdd');
}

exports.addAction = async (request, response) => {
    const post = new Post(request.body);
    
    await post.save();

    response.redirect('/');
} 