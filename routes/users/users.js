const express = require("express");
const {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  uploadProfilePhotoCtrl,
  uploadCoverImgCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
} = require("../../controllers/users/users");

const protected = require("../../middlewares/protected");
const storage = require("../../config/cloudinary");
const multer = require('multer');

const userRoutes = express.Router();


//Instance of multer 
const upload = multer({storage})



//Rendering Forms
userRoutes.get('/login', (req,res)=>{
  res.render('users/login');
})
userRoutes.get('/register', (req,res)=>{
  res.render('users/register');
})
userRoutes.get('/profile-page', (req,res)=>{
  res.render('users/profile');
})
userRoutes.get('/upload-profile-photo-form', (req,res)=>{
  res.render('users/uploadProfilePhoto');
})
userRoutes.get('/upload-cover-photo-form', (req,res)=>{
  res.render('users/uploadProfilePhoto');
})
//Update User Form
userRoutes.get('/update-user-form', (req,res)=>{
  res.render('users/updateUser');
})


//POST/api/v1/users/register
userRoutes.post("/register", registerCtrl);

//POST/api/v1/users/login
userRoutes.post("/login", loginCtrl);

//GET/api/v1/users/profile/:id
userRoutes.get("/profile", protected, profileCtrl);

//PUT/api/v1/users/profile-photo-upload/:id
userRoutes.put("/profile-photo-upload/",protected, upload.single('profile'), uploadProfilePhotoCtrl);

//PUT/api/v1/users/cover-photo-upload/:id
userRoutes.put("/cover-photo-upload/",protected, upload.single('cover'), uploadCoverImgCtrl);

//PUT/api/v1/users/update-password/:id
userRoutes.put("/update-password/:id", updatePasswordCtrl);

//PUT/api/v1/users/update/:id
userRoutes.put("/update/:id", updateUserCtrl);

//GET/api/v1/users/:id
userRoutes.get("/:id", userDetailsCtrl);

//GET/api/v1/users/logout
userRoutes.get("/logout", logoutCtrl);

module.exports = userRoutes;
