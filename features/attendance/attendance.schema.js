import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    startTime: Date,
    endTime: Date,
    totalHours: Number,
    isLate: Boolean,
    isEarlyLeaving: Boolean,
    status:{type:String,default:"Active"},
},{timestamps:true});

export const AttendanceSchema = mongoose.model('AttendanceSchema', attendanceSchema);