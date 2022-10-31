const { model, Schema} = require('mongoose');
const postSchema = new Schema({ //mongo db schema object for Post collection
    body : String,
    username : String,
    createdAt : String,
    comments : [
        {
            body: String,
            username: String,
            createdAt : String
        }
    ],
    likes : [
        {
            username: String,
            createdAt: String
        }
    ],
    user : { 
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

module.exports = model('Post', postSchema);  //export mongoose Post collection via postSchema defined above