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
    
    const postFilter = (typeof responseJson.tag != 'undefined') ? { tags: responseJson.tag } : {};
    //const postFilter = (typeof responseJson.tag != 'undefined') ? { tags: responseJson.tag }: {};

    const tagsPromise = Post.getTagsList();
    const postsPromise = Post.find(postFilter);
    
    const [ tags, posts ] = await Promise.all([ tagsPromise, postsPromise ]);

    for(let i in tags) {
        if (tags[i]._id == responseJson.tag) {
            tags[i].class = "selected";
        }
    }

    console.log(tags);

    responseJson.tags = tags;

    responseJson.posts = posts;

    response.render('home', responseJson);
}