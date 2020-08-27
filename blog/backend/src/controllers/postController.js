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

exports.edit = async (request, response) => {
    try {
        const post = await Post.findOneAndUpdate(
            { _id : request.params.id },
            request.body,
            {
                new: true,
                runValidators: true
            }
        )
        return response.json(post);
    } catch (error) {
        console.log('Um erro ocorreu, tente novamente mais tarde!');
    }

}

exports.viewPost = async (request, response) => {
    try {
      const post = await Post.findById(request.params.id);

      return response.json(post);  
    } catch (error) {
        console.log('Ocorreu um erro! Tente novamente mais tarde');
    }
}