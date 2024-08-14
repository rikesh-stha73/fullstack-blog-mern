require("dotenv").config();
const express = require('express');
const session = require("express-session");
const MongoStore = require("connect-mongo");
const userRoutes = require("./routes/users/users");
const postRoutes = require("./routes/posts/posts");
const commentRoutes = require("./routes/comments/comment");
const globalErrHandler = require("./middlewares/globalErrHandler");
const app = express();
require("./config/dbConnect");
//!middlewares
app.use(express.json()); //!Pass incoming data

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

//!configure ejs
app.set('view engine', 'ejs');
//serve static files
app.use(express.static(__dirname + "/public"));

//!Routes
//?render Home page
app.get('/', (req,res) =>{
    res.render("index");
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
