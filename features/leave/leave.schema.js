import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
    employee: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Employee"},
    leaveType: {type: String, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    isHalfDay: {type: Boolean, required: true, default: false},
    status: {type: String, enum: ["Pending", "Approved", "System", "Reject"], default: "Pending"},
}, {timestamps: true});

export const Leave = mongoose.model("Leave", leaveSchema);