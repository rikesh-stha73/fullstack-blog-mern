const mongoose = require('mongoose');

const dbConnect = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB connected Successfully');
    }catch(error){
        console.log('DB Connect failed',error);
    }
};

dbConnect();