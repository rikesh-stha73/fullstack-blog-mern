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
  res.render('users/login',{
    error:''
  });
})
userRoutes.get('/register', (req,res)=>{
  res.render('users/register',{
    error:''
  });
})

userRoutes.get('/upload-profile-photo-form', (req,res)=>{
  res.render('users/uploadProfilePhoto',{
    error:''
  });
})
userRoutes.get('/upload-cover-photo-form', (req,res)=>{
  res.render('users/uploadCoverPhoto',{
    error:''
  });
})

//update user password
userRoutes.get('/updatePassword', (req,res)=>{
  res.render('users/updatePassword',{
    error:''
  });
})
// //Update User Form
// userRoutes.get('/update-user-form', (req,res)=>{
//   res.render('users/updateUser');
// })



//POST/api/v1/users/register
userRoutes.post("/register", registerCtrl);

//POST/api/v1/users/login
userRoutes.post("/login", loginCtrl);

//GET/api/v1/users/profile/:id
userRoutes.get("/profile-page", protected, profileCtrl);

//PUT/api/v1/users/profile-photo-upload/:id
userRoutes.put("/profile-photo-upload/",protected, upload.single('profile'), uploadProfilePhotoCtrl);

//PUT/api/v1/users/cover-photo-upload/:id
userRoutes.put("/cover-photo-upload/",protected, upload.single('cover'), uploadCoverImgCtrl);

//PUT/api/v1/users/update-password/:id
userRoutes.put("/update-password/", updatePasswordCtrl);

//PUT/api/v1/users/update/:id
userRoutes.put("/update/", updateUserCtrl);

//GET/api/v1/users/logout
userRoutes.get("/logout", logoutCtrl);

//GET/api/v1/users/:id
userRoutes.get("/:id", userDetailsCtrl);


module.exports = userRoutes;
