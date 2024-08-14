const User = require("../../model/user/User");
const Post = require("../../model/post/Post");
const Comment = require("../../model/comment/Comment");
const { post } = require("../../routes/users/users");

//create
const createCommentCtrl = async (req, res) => {
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
        user: "comment created",
      });
    } catch (error) {
      res.json(error);
    }
  };
  
  //single
  const commentDetailsCtrl = async (req, res) => {
    try {
      res.json({
        status: "success",
        user: "Post comments",
      });
    } catch (error) {
      res.json(error);
    }
  };
  
  //delete
  const deleteCommentCtrl = async (req, res) => {
    try {
      res.json({
        status: "success",
        user: "comment deleted",
      });
    } catch (error) {
      res.json(error);
    }
  };
  
  //Update
  const updateCommentCtrl = async (req, res) => {
    try {
      res.json({
        status: "success",
        user: "comment updated",
      });
    } catch (error) {
      res.json(error);
    }
  };
  
  module.exports = {
    createCommentCtrl,
    commentDetailsCtrl,
    deleteCommentCtrl,
    updateCommentCtrl,
  };
  