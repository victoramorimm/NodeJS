const mongoose = require('mongoose');
const Post = mongoose.model('Post');

exports.index = async (request, response) => {
    let responseJson = {
        pageTitle: 'HOME',
        posts: []
    };

    const posts = await Post.find();
    
    responseJson.posts = posts;

    response.render('home', responseJson);
}