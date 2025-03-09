import mongoose from "mongoose";
import { config } from "./app.config.js";

const connectDatabase = async () => {
    try {
        await mongoose.connect(config.MONGO_URL);
        console.log("Connected to MongoDB Database")
    } catch (error) {
        console.log("Error connecting to Mongo  database")
        process.exit(1);
    }
};

export default connectDatabase;
