import mongoose from "mongoose";


const branchSchema = new mongoose.Schema({
    branchName:{type:String,required:true},
    branchCode:{type:String,required:true},
    longitude:{type:Number,required:true},
    latitude:{type:Number,required:true},
    status:{type:String,required:true,default:"Active"},
    contact:{type:mongoose.Schema.Types.ObjectId,ref:"Contact"},
},{timestamps:true});

export const Branch = mongoose.model('Branch', branchSchema);