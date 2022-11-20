import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();
const password = process.env.DBPASSWORD;

const connectToMongoose = () =>
  mongoose.connect(
    `mongodb+srv://amandahp:${password}@cluster0.t1tkam6.mongodb.net/room-ironhack?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

export default connectToMongoose;
