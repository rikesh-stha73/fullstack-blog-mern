const mongoose = require('mongoose');   

//Comment Schema
const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    }
},
{
    timestamps: true
}
);

//compile the schema to form a model
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;