import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema({
    empId: { type: mongoose.Schema.ObjectId, required: true, ref: "Employee" },
    basicSalary: { type: Number, required: true },
    netSalary: { type: Number, required: true },
    deduction: { type: Number, required: true },
    allowance: { type: Number, required: true },
    deductionTypes:[{name:{type:String},amount:{type:Number}}],
    allowanceTypes:[{name:{type:String},amount:{type:Number}}],
    status: {type: String, enum: ["Pending", "Paid", "Cancelled"], default: "Pending"},
    currency: {type: String, default: "LKR"},
    period: {type: String, required: true,},
},{timestamps: true});

export const Payroll = mongoose.model("Payroll", payrollSchema);