//create
const createPostCtrl = async (req, res) => {
    try {
      res.json({
        status: "success",
        user: "Post created",
      });
    } catch (error) {
      res.json(error);
    }
  };
  
  //all
  const fetchPostsCtrl = async (req, res) => {
    try {
      res.json({
        status: "success",
        user: "Posts list",
      });
    } catch (error) {
      res.json(error);
    }
  };
  
  //details
  const fetchPostCtrl = async (req, res) => {
    try {
      res.json({
        status: "success",
        user: "Post details",
      });
    } catch (error) {
      res.json(error);
    }
  };
  
  //delete
  const deletePostCtrl = async (req, res) => {
    try {
      res.json({
        status: "success",
        user: "Post deleted",
      });
    } catch (error) {
      res.json(error);
    }
  };
  
  //update
  const updatepostCtrl = async (req, res) => {
    try {
      res.json({
        status: "success",
        user: "Post updated",
      });
    } catch (error) {
      res.json(error);
    }
  };
  module.exports = {
    createPostCtrl,
    fetchPostsCtrl,
    fetchPostCtrl,
    deletePostCtrl,
    updatepostCtrl,
  };
  