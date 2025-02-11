import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    empId:{type:mongoose.Schema.Types.ObjectId,ref:"Employee", required: true},
},{ timestamps: true });

export const Notifications = mongoose.model("Notifications",notificationSchema);