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
        status:{type:String,enum:["Normal","Supervisor","System Closed"],default:"Normal"},
    },
    status:{type:String,enum:["Normal","Supervisor"],default:"Normal"},
    empId:{type:mongoose.Schema.Types.ObjectId, ref:"Employee"},
},{timestamps:true});

export const Attendance = mongoose.model('Attendance', attendanceSchema);