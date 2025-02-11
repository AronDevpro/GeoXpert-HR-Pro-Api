import mongoose from "mongoose";

const cronSchema = new mongoose.Schema({
    name: { type: String, required: true },
    reason: { type: String, required: false },
    status: { type: String, enum: ["Success", "Fail"], default: "Success" },
    executedAt: { type: Date, default: Date.now },
    duration: { type: Number, required: false },
},{ timestamps: true });

export const Cron = mongoose.model('Cron', cronSchema);
