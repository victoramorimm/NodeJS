const mongoose = require('mongoose');
const Post = mongoose.model('Post');

exports.index = async (request, response) => {
    let responseJson = {
        pageTitle: 'HOME',
        posts: [],
        tags: [],
        tag: ''
    };
    
    responseJson.tag = request.query.tag;
    
    const tags = await Post.getTagsList();
    
    for(let i in tags) {
        if (tags[i]._id == responseJson.tag) {
            tags[i].class = "selected";
        }
    }

    console.log(tags);

    responseJson.tags = tags;


    const posts = await Post.find();
    
    responseJson.posts = posts;

    response.render('home', responseJson);
}