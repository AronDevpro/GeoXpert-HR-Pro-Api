import mongoose from "mongoose";

const officeShiftsSchema = new mongoose.Schema({
    name:{type:String,unique:true,required:true},
    description:String,
    status: {type:String,default:"active"},
},{ timestamps: true });

export const OfficeShift = mongoose.model("OfficeShift",officeShiftsSchema);