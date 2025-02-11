import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
    siteName: {type: String, required: true},
    logo: {type: String, required: true},
    email: {
        host: String,
        port: Number,
        secure: {type: Boolean, default: true},
        user: String,
        pass: String
    },
    oneSignal: {
        userAuthKey: String,
        restApiKey: String,
        appId:String,
    },
}, {timestamps: true});

export const Setting = mongoose.model("Setting", settingSchema);