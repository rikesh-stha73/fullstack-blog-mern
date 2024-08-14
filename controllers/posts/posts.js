const Post = require("../../model/post/Post");
const User = require("../../model/user/User");
const appErr = require("../../utils/appErr");

//create
const createPostCtrl = async (req, res, next) => {
  const { title, description, category, image, user } = req.body;
    try {
      if(!title || !description || !category || !req.file ){
        return next(appErr("Please provide all fields", 400));
      }
      //? Find the user
      const userId = req.session.userAuth;
      const userFound = await User.findById(userId);
      if (!userFound) {
        //! Throw error
        return next(appErr("User not found", 403));
      }
      const postCreated = await Post.create({
        title,
        description,
        category,
        image:req.file.path,
        user: userId,
      })

      //push the post created to the user
      userFound.posts.push(postCreated._id);
      await userFound.save();
      res.json({
        status: "success",
        data: postCreated,
      });
    } catch (error) {
      next(appErr(error.message, 400));
    }
  };
  
  //details of a post
  const fetchPostCtrl = async (req, res, next) => {
    try {
      //get id from params
      const tid = req.params.id;
      //find the post
      const post = await Post.findById(tid).populate("comments"); 
      res.json({
        status: "success",
        data: post,
      });
    } catch (error) {
        next(appErr(error.message, 400));
      }
  };
  
  //all
  const fetchPostsCtrl = async (req, res, next) => {
    try {
      const post = await Post.find().populate("comments");
      res.json({
        status: "success",
        data: post,
      });
    } catch (error) {
    next(appErr(error.message, 400));
   }
  };
  
  //delete
  const deletePostCtrl = async (req, res,next) => {
    try {
      //find the post\
      const post = await Post.findById(req.params.id);
      //check if post belongs to user
      if (post.user.toString() !== req.session.userAuth) {
        return next(appErr("You don't have permission to delete this post", 403));
      }
      //delete Post
      await Post.findByIdAndDelete(req.params.id);
      res.json({
        status: "success",
        data: "Post has been deleted successfully",
      });
    } catch (error) {
        next(appErr(error.message, 400));
    }
  };
  
  //update
  const updatepostCtrl = async (req, res, next) => {
    const { title, description, category } = req.body;
    try {
     
       //find the post
       const post = await Post.findById(req.params.id);
       //check if post belongs to user
       if (post.user.toString() !== req.session.userAuth) {
         return next(appErr("You don't have permission to update this post", 403));
       }
       const updateData = { title, description, category };
       if (req.file) {
           updateData.image = req.file.path;
       }
       //update the post
       const postUpdated = await Post.findByIdAndUpdate(req.params.id, updateData,{
        new: true,
       })

      res.json({
        status: "success",
        data: postUpdated,
      });
    } catch (error) {
      next(appErr(error.message, 400));
    }
  };
  module.exports = {
    createPostCtrl,
    fetchPostsCtrl,
    fetchPostCtrl,
    deletePostCtrl,
    updatepostCtrl,
  };
  