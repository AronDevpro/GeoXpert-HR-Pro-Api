import mongoose from "mongoose";


const branchSchema = new mongoose.Schema({
    branchName:{type:String,required:true, unique:true},
    branchCode:{type:String,required:true,unique:true},
    longitude:{type:Number,required:true},
    latitude:{type:Number,required:true},
    radius:{type:Number,required:true},
    status:{type:String,required:true,enum:["Active","Inactive"],default:"Active"},
    contact:{type:mongoose.Schema.Types.ObjectId,ref:"Contact"},
},{timestamps:true});

export const Branch = mongoose.model('Branch', branchSchema);