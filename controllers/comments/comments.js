const User = require("../../model/user/User");
const Post = require("../../model/post/Post");
const Comment = require("../../model/comment/Comment");
const { post } = require("../../routes/users/users");
const appErr = require("../../utils/appErr");

//create
const createCommentCtrl = async (req, res, next) => {
    const { message } = req.body;
  
    try {
      //Find the post
      const post = await Post.findById(req.params.id);
      //create comment
      const comment = await Comment.create({
        user: req.session.userAuth,
        message,
      })
      //push comment to post
      post.comments.push(comment._id);
      //find the user
      const user = await User.findById(req.session.userAuth);
      //push comment to user
      user.comments.push(comment._id);
      //disable validation
      //save
      await post.save({validateBeforeSave: false});
      await user.save({validateBeforeSave: false});
      res.json({
        status: "success",
        data: comment,
      });
    } catch (error) {
      next(appErr(error.message, 400));
    }
  };
  
  //single
  const commentDetailsCtrl = async (req, res,next) => {
    try {
      const id = req.params.id;

      const comment = await Comment.findById(id); 

      res.json({
        status: "success",
        data: comment,
      });
    } catch (error) {
      next(appErr(error.message, 400));
    }
  };
  
  //delete
  const deleteCommentCtrl = async (req, res, next) => {
    try {
      //find the post\
      const comment = await Comment.findById(req.params.id);
      //check if post belongs to user
      if (comment.user.toString() !== req.session.userAuth) {
        return next(appErr("You don't have permission to delete this comment", 403));
      }
      //delete Post
      await Comment.findByIdAndDelete(req.params.id);
      res.json({
        status: "success",
        data: "Comment has been deleted successfully",
      });
    } catch (error) {
        next(appErr(error.message, 400));
    }
  };
  
  //Update
  const updateCommentCtrl = async (req, res,next) => {
    const { message } = req.body;
    try {
     
       //find the comment
       const comment = await Comment.findById(req.params.id);
       if (!comment) {
         return next(appErr("Comment not found", 404));
       }
       //check if comment belongs to user
       if (comment.user.toString() !== req.session.userAuth) {
         return next(appErr("You don't have permission to update this comment", 403));
       }
      
       //update the post
       const commentUpdate = await Comment.findByIdAndUpdate(req.params.id, {
        message,
       },{
        new: true,
       })

      res.json({
        status: "success",
        data: commentUpdate,
      });
    } catch (error) {
      next(appErr(error.message, 400));
    }
  };
  
  module.exports = {
    createCommentCtrl,
    commentDetailsCtrl,
    deleteCommentCtrl,
    updateCommentCtrl,
  };
  