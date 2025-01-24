import mongoose from "mongoose";

const officeShiftsSchema = new mongoose.Schema({
    name:{type:String,unique:true,required:true},
    startTime:{type:String,required:true},
    endTime:{type:String,required:true},
    description:String,
    status: {type:String,enum:["Active","Inactive"],default:"Active"},
},{ timestamps: true });

export const OfficeShift = mongoose.model("OfficeShift",officeShiftsSchema);