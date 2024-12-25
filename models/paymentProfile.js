import mongoose from "mongoose";

const paymentProfileSchema = new mongoose.Schema({
    bankName: String,
    accountNumber: String,
    branch: String,
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
},{timestamps: true});

export const PaymentProfile = mongoose.model('PaymentProfile', paymentProfileSchema);