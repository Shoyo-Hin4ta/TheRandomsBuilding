import mongoose from "mongoose";

const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
        console.log("mongoDB connected !! DB HOST: "+ connectionInstance.connection.host);

    } catch (error) {
        console.log(error);
    }
}

export default connectDB;