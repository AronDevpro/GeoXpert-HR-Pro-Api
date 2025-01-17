import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
    name: { type: String, required: true },
    employee: {type: mongoose.Schema.Types.ObjectId, required: true, ref:"Employee" },
    leaveType:{type:String, required: true},
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isHalfDay:{ type: Boolean, required: true ,default:false },
    status:{type:String,default:"Pending"},
}, { timestamps: true });

export const Leave = mongoose.model("Leave", leaveSchema);