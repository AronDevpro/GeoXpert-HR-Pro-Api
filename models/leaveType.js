import mongoose from "mongoose";

const leaveTypeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    daysPerYear: { type: Number, required: true },
    approvalNeeded: { type: Boolean, required: true ,default: false },
    status:String,
}, { timestamps: true });

export const LeaveType = mongoose.model("LeaveType", leaveTypeSchema);