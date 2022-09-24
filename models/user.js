import mongoose from "mongoose";
import { Schema } from "mongoose";

const User = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
   password:{
        type:String,
        required:true
    },
  address: {
    type: String,
    required: true,
  },
});

export default mongoose.model("User", User);