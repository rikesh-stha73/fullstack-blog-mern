require("dotenv").config();
const express = require('express');
const session = require("express-session");
const methodOverride = require("method-override");
const MongoStore = require("connect-mongo");
const userRoutes = require("./routes/users/users");
const postRoutes = require("./routes/posts/posts");
const commentRoutes = require("./routes/comments/comment");
const globalErrHandler = require("./middlewares/globalErrHandler");
const Post = require("./model/post/Post");
const app = express();
require("./config/dbConnect");
//!middlewares
app.use(express.json()); //!Pass incoming data

app.use(express.urlencoded({ extended: true }));//!Pass incoming data from browser

//method Override
app.use(methodOverride("_method"));
//session config
app.use(
    session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        mongoUrl: process.env.MONGO_URL,
        ttl : 24*60*60, //1 day
    }),
})
);

//save the login user to locals
app.use((req, res, next) => {
    if (req.session.userAuth) {
        res.locals.userAuth = req.session.userAuth;
    }else{
        res.locals.userAuth = null;
    }
    next();
})

//!configure ejs
app.set('view engine', 'ejs');
//serve static files
app.use(express.static(__dirname + "/public"));

//!Routes
//?render Home page
app.get('/', async (req,res) =>{
    try {
        const post = await Post.find();
        res.render("index", {post});
    }catch(error){
        res.render("index", {error: error.message});
    }
})

//?User Routes
app.use("/api/v1/users", userRoutes);

//?Post Routes
app.use("/api/v1/posts", postRoutes);

//?Comment Routes
app.use("/api/v1/comments", commentRoutes);

//!Error handling and Middlewares
app.use(globalErrHandler);

//!Lister Port
const PORT = process.env.PORT || 9000;
app.listen(PORT, console.log(`Server running on ${PORT}`));
