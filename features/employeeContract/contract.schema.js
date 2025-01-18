import mongoose from "mongoose";

const contractSchema = new mongoose.Schema({
    department:{type: String, required:true},
    designation:{type: String, required:true},
    joinDate:{type:Date, default:Date.now,required: true},
    endDate:{type:Date},
    officeShift:{type: String, required:true},
    description:String,
    basicSalary:Number,
    paySlipType:{type:String,required:true,default:"Monthly"},
    status:{type:String,enum: ["Active", "Terminated"],default:"Active"},
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
}, { timestamps: true });

export const Contracts = mongoose.model('Contracts', contractSchema);