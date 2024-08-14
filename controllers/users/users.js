const bcrypt = require("bcryptjs");
const User = require("../../model/user/User");
const appErr = require("../../utils/appErr");
//register
const registerCtrl = async (req, res, next) => {
  const { fullname, email, password } = req.body;
  //* Check if fields are empty
  if(!fullname || !email || !password) {
    return next(appErr("All fields are required", 400));
  }

    try {
       //? 1. Check if user Exists
       const userFound = await User.findOne({ email });
       //throw an error here
       if(userFound) {
        return next(appErr("User already exists", 400));
      }

      //? Hash Password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      //? Register User
      const user = await User.create({ 
        fullname, 
        email, 
        password:hashedPassword,
      });
       res.json({
        status: "success",
        data: user,
      });
    } catch (error) {
       res.json(error);
    }
  };
  
  //login
  const loginCtrl = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(appErr("All fields are required", 400));
    }
    try {
      //? Check if user exists
      const userFound = await User.findOne({ email });
      if (!userFound) {
        //! Throw error
        return res.json({
          status: "failed",
          data: "Invalid Login Credentials",
        });
      }
      //? Check if password is correct
      const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) {
          //! Throw error
          return res.json({
            status: "failed",
            data: "Invalid Login Credentials",
          });
        }

        //* Save user in session
        req.session.userAuth = userFound._id;
       res.json({
        status: "success",
        data: userFound,
      });
    } catch (error) {
       res.json(error);
    }
  };
  
  //details
  const userDetailsCtrl = async (req, res) => {
    try {
      //? Get userId from params
      const userId = req.params.id;

      //? find the user
      const user = await User.findById(userId);
      res.json({
        status: "success",
        data: user,
      });
    } catch (error) {
      res.json(error);
    }
  };
  //profile
  const profileCtrl = async (req, res) => {
    try {
      //? Get login user details
      const userId = req.session.userAuth;

      //? find the user
      const user = await User.findById(userId).populate("posts").populate("comments");
      res.json({
        status: "success",
        data: user,
      });
    } catch (error) {
      res.json(error);
    }
  };
  
  //upload profile photo
  const uploadProfilePhotoCtrl = async (req, res, next) => {
    
    try {
      // Find the user to be updated
      const userId = req.session.userAuth;
      const userFound = await User.findById(userId);
      if (!userFound) {
        //! Throw error
        return next(appErr("User not found", 403));
      }
      await User.findByIdAndUpdate(userId, {
        profileImage: req.file.path,
      },{
        new: true,
      })
      res.json({
        status: "success",
        data: "You have successfully uploaded your profile photo",
      });
    } catch (error) {
    return next(appErr(error.message, 400));
  }
  };
  
  //upload cover image
  
  const uploadCoverImgCtrl = async (req, res, next) => {
    try {
       // Find the user to be updated
       const userId = req.session.userAuth;
       const userFound = await User.findById(userId);
       if (!userFound) {
         //! Throw error
         return next(appErr("User not found", 403));
       }
       await User.findByIdAndUpdate(userId, {
         coverImage: req.file.path,
       },{
         new: true,
       })
      res.json({
        status: "success",
        data: "You have successfully uploaded your cover photo",
      });
    } catch (error) {
      return next(appErr("User not found", 403));
    }
  };
  
  //update password
  const updatePasswordCtrl = async (req, res, next) => {
    const { password} = req.body;

    try {
      //? check if user is updating the password
      if(password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
          
        //?update password
        await User.findByIdAndUpdate(req.params.id, {
          password:hashedPassword,
        },{
          new: true,
        })
      }

      res.json({
        status: "success",
        user: "Password has been changed successfully",
      });
    } catch (error) {
    return next(appErr("Please provide the password field", 400));
  }
  };
  
  //update user
  const updateUserCtrl = async (req, res, next) => {
    const { fullname, email } = req.body;
    try {
      //! check if email is not taken
      if(email) {
        const emailTaken = await User.findOne({ email });
        if(emailTaken) {
          return next(appErr("Email is already taken", 400));
        }
      }
      //? update the user
      const user = await User.findByIdAndUpdate(req.params.id, {
        fullname,
        email,
      },{
        new: true,
      });
      res.json({
        status: "success",
        data: user,
      });
    } catch (error) {
      return next(appErr(error.message, 400));
    }
  };
  
  //logout
  const logoutCtrl = async (req, res) => {
    try {
      res.json({
        status: "success",
        user: "User logout",
      });
    } catch (error) {
      res.json(error);
    }
  };
  
  module.exports = {
    registerCtrl,
    loginCtrl,
    userDetailsCtrl,
    profileCtrl,
    uploadProfilePhotoCtrl,
    uploadCoverImgCtrl,
    updatePasswordCtrl,
    updateUserCtrl,
    logoutCtrl,
  };
  