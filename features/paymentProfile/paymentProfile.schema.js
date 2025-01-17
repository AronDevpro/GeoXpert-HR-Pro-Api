import mongoose from "mongoose";

const paymentProfile = new mongoose.Schema({
    bankName: String,
    accountNumber: String,
    branch: String,
    accountHolderName: String,
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
},{timestamps: true});

export const PaymentProfile = mongoose.model('PaymentProfile', paymentProfile);