import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    console.log("Connecting to the database", process.env.MONGODB_URI);
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log("Connected to the database", connectionInstance.connections[0].name);
  } catch (error) {
    console.log("MONGODB connection error in db/index.js", error);
    process.exit(1);
  }
};

export default connectDB;
