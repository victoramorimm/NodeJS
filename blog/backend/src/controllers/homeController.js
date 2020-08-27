const mongoose = require('mongoose');
const Post = mongoose.model('Post');

exports.listPosts = async (request, response) => {
    const posts = await Post.find()

    return response.json(posts);
}