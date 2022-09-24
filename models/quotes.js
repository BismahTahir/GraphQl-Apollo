import mongoose from "mongoose";

const Quotes=new mongoose.Schema({

    quote:{
        type:String,
        required:true
    },
    by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})

export default mongoose.model("Quote",Quotes)