const bcrypt = require("bcryptjs");
const User = require("../../model/user/User");
const appErr = require("../../utils/appErr");
const { render } = require("ejs");
//register
const registerCtrl = async (req, res, next) => {
  const { fullname, email, password } = req.body;
  //* Check if fields are empty
    if(!fullname || !email || !password) {
      // return next(appErr("All fields are required", 400));
      return res.render('users/register', {
        error: "All fields are required",
      })
    }

    try {
       //? 1. Check if user Exists
       const userFound = await User.findOne({ email });
       //throw an error here
       if(userFound) {
        // return next(appErr("User already exists", 400));
        return res.render('users/register', {
          error: "User Email already exists",
      })

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

      //  res.json({
      //   status: "success",
      //   data: user,
      // });

      //?Redirect
      res.redirect("/api/v1/users/profile-page");
    } catch (error) {
      //  res.json(error);
      return res.render('users/register', {
        error: error.message,
      })
    }
  };
  
  //login
  const loginCtrl = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      // return next(appErr("All fields are required", 400));
      return res.render('users/login', {
        error: "All fields are required",
      })
    }
    try {
      //? Check if user exists
      const userFound = await User.findOne({ email });
      if (!userFound) {
        //! Throw error
        // return res.json({
        //   status: "failed",
        //   data: "Invalid Login Credentials",
        // });
        return res.render('users/login', {
          error: "Invalid Login Credentials",
        })

      }
      //? Check if password is correct
      const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) {
          //! Throw error
          // return res.json({
          //   status: "failed",
          //   data: "Invalid Login Credentials",
          // });

          return res.render('users/login', {
            error: "Invalid Login Credentials",
          })
        }

        //* Save user in session
        req.session.userAuth = userFound._id;
      //  res.json({
      //   status: "success",
      //   data: userFound,
      // });
      
      //?Redirect
      res.redirect("/api/v1/users/profile-page");
    } catch (error) {
      //  res.json(error);
       return res.render('users/login', {
        error: error.message,
      })
    }
  };
  
  //details
  const userDetailsCtrl = async (req, res) => {
    try {
      //? Get userId from params
      const userId = req.params.id;

      //? find the user
      const user = await User.findById(userId);
      // res.json({
      //   status: "success",
      //   data: user,
      // });

      res.render('users/updateUser', {user, error: ""});
    } catch (error) {
      // res.json(error);
      return res.render('users/updateUser', {
        error: error.message,
      })
    }
  };
  //profile
  const profileCtrl = async (req, res) => {
    try {
      //? Get login user details
      const userId = req.session.userAuth;

      //? find the user
      const user = await User.findById(userId)
      .populate("posts")
      .populate("comments");
      // res.json({
      //   status: "success",
      //   data: user,
      // });

      res.render('users/profile', {user});
    } catch (error) {
      res.json(error);
    }
  };
  
  //upload profile photo
  const uploadProfilePhotoCtrl = async (req, res, next) => {
    try {
      //check if file exists
      if(!req.file) {
        //! Throw error
        // return next(appErr("Please upload aa image", 400));
        return res.render('users/uploadProfilePhoto', {
          error: "Please upload an image",
        });
      }
      // Find the user to be updated
      const userId = req.session.userAuth;
      const userFound = await User.findById(userId);
      if (!userFound) {
        //! Throw error
        // return next(appErr("User not found", 403));
        return res.render('users/profile', {
          error: "User not found",
        });
      }
      await User.findByIdAndUpdate(userId, {
        profileImage: req.file.path,
      },{
        new: true,
      })
      // res.json({
      //   status: "success",
      //   data: "You have successfully uploaded your profile photo",
      // });

      //redirect
      res.redirect("/api/v1/users/profile-page");
    } catch (error) {
    // return next(appErr(error.message, 400));
    return res.render('users/profile', {
      error:error.message,
      
    });
  }
  };
  
  //upload cover image
  
  const uploadCoverImgCtrl = async (req, res, next) => {
    try {
       //check if file exists
      if(!req.file) {
        //! Throw error
        // return next(appErr("Please upload aa image", 400));
        return res.render('users/uploadCoverPhoto', {
          error: "Please upload an image",
        });
      }
      // Find the user to be updated
      const userId = req.session.userAuth;
      const userFound = await User.findById(userId);
      if (!userFound) {
        //! Throw error
        // return next(appErr("User not found", 403));
        return res.render('users/profile', {
          error: "User not found",
        });
      }
      await User.findByIdAndUpdate(userId, {
        coverImage: req.file.path,
      },{
        new: true,
      })
      // res.json({
      //   status: "success",
      //   data: "You have successfully uploaded your profile photo",
      // });

      //redirect
      res.redirect("/api/v1/users/profile-page");
    } catch (error) {
    // return next(appErr(error.message, 400));
    return res.render('users/profile', {
      error:error.message,
    });
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
        await User.findByIdAndUpdate(req.session.userAuth, {
          password:hashedPassword,
        },{
          new: true,
        })
      }

      // res.json({
      //   status: "success",
      //   user: "Password has been changed successfully",
      // });
      //redirect
      res.redirect("/api/v1/users/profile-page");
    } catch (error) {
      // return next(appErr(error.message, 400));
      return res.render('users/profile-page', {
        error:error.message,
      user:"",

      });      
    }
  };
  
  //update user
  const updateUserCtrl = async (req, res, next) => {

    const { fullname, email } = req.body;
    try {
      if(!email || !fullname) {
        return res.render('users/updateUser', {
          error:"Please Provide Details",
          user:"",

        }); 
      }

      //! check if email is not taken
      if(email) {
        const emailTaken = await User.findOne({ email });
        if(emailTaken) {
          // return next(appErr("Email is already taken", 400));
          return res.render('users/updateUser', {
            error:"Email is already taken",
            user:"",

          }); 
        }
      }
      //? update the user
       await User.findByIdAndUpdate(req.session.userAuth, {
        fullname,
        email,
      },{
        new: true,
      });
      // res.json({
      //   status: "success",
      //   data: user,
      // });
      

      //redirect
      res.redirect("/api/v1/users/profile-page");
    } catch (error) {
      // return next(appErr(error.message, 400));
      return res.render('users/updateUser', {
        error:error.message,
      user:"",

      });      
    }
  };
  
  //logout
  const logoutCtrl = async (req, res) => {
      //Destroy session
      req.session.destroy(()=>{
        res.redirect("/api/v1/users/login");
      });
      // res.json({
      //   status: "success",
      //   user: "User logout",
      // });
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
  