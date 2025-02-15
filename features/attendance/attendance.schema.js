import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    totalHours: Number,
    clockIn:{
        time: String,
        isLate: Boolean,
        longitude:String,
        latitude:String,
        status:{type:String,enum:["Normal","Supervisor"],default:"Normal"},
    },
    clockOut:{
        time: String,
        isEarlyLeaving: Boolean,
        isSystemClose:Boolean,
        longitude:String,
        latitude:String,
        status:{type:String,enum:["Normal","Supervisor","System Closed"]},
    },
    status:{type:String,enum:["Normal","Supervisor","Leave"],default:"Normal"},
    empId:{type:mongoose.Schema.Types.ObjectId, ref:"Employee", required:true},
},{timestamps:true});

export const Attendance = mongoose.model('Attendance', attendanceSchema);