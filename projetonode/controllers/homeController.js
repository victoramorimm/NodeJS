const mongoose = require('mongoose');
const Post = mongoose.model('Post');

exports.index = async (request, response) => {
    let responseJson = {
        pageTitle: 'HOME',
        posts: [],
        tags: []
    };

    const tags = await Post.getTagsList();
    
    console.log(tags);

    responseJson.tags = tags;

    const posts = await Post.find();
    
    responseJson.posts = posts;

    response.render('home', responseJson);
}