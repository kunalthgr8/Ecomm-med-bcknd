import dotenv from "dotenv";
import connectDB from "./db/index.js";
dotenv.config({
    path: "./.env",
    
})

connectDB();

// const app = express();

// (async () => {
//   try {
//     console.log("Connecting to the database", process.env.MONGODB_URI);
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     app.on("error", (error) => {
//       console.log("Error connecting to the database");
//       throw error;
//     });
//     app.listen(process.env.PORT, () => {
//       console.log(`Server running on port ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// })();
