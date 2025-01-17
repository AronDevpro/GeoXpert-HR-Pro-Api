import mongoose from "mongoose";


const refreshTokenSchema = new mongoose.Schema({
    token:{ type: String,unique: true, required: true },
    expiryDate: { type: Date, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
},{timestamps: true});

export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema)