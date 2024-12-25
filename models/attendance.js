import mongoose, {Mongoose} from "mongoose";

const attendanceSchema = new mongoose.Schema({
    startTime: Date,
    endTime: Date,
    totalHours: Number,
    isLate: Boolean,
    isEarlyLeaving: Boolean,
    status:{type:String,default:"Active"},
},{timestamps:true});

export const Attendance = mongoose.model('Attendance', attendanceSchema);