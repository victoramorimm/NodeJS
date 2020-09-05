const mongoose = require('mongoose');
const slug = require('slug');
const Post = mongoose.model('Post');

exports.add = (request, response) => {
    response.render('postAdd');
}

exports.addAction = async (request, response) => {
   request.body.tags = request.body.tags.split(',').map(tag => tag.trim());
   request.body.author = request.user._id;

    const post = new Post(request.body);

    try {
        await post.save();
    } catch (error) {
        request.flash('error', 'Ocorreu um erro! Tente novamente mais tarde');
    }

    request.flash('success', 'Post salvo com sucesso!');

    response.redirect('/');
}

exports.edit = async (request, response) => {
    const post = await Post.findOne({ slug: request.params.slug });

    response.render('postEdit', { post });
} 

exports.editAction = async (request, response) => {
    request.body.slug = slug(request.body.title, { lower: true });
    
    request.body.tags = request.body.tags.split(',').map(tag => tag.trim());

    try {
      const post = await Post.findOneAndUpdate(
         {slug: request.params.slug},
          request.body,
          {
             new: true,
             runValidators: true, 
          }
       );
        
    } catch (error) {
        request.flash('error', 'Ocorreu um erro! Tente novamente mais tarde');
        return response.redirect('/post/' + request.params.slug + '/edit');
    }


    request.flash('success', 'Post atualizado com sucesso!');

    response.redirect('/');
}

exports.view = async (request, response) => {
    const post = await Post.findOne({ slug: request.params.slug });

    response.render('view', { post });
}