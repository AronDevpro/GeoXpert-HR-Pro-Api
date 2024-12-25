import mongoose from "mongoose";

const contactSchema = mongoose.Schema({
    phoneNumberOne:String,
    addressNumber:String,
    addressLineOne:String,
    addressLineTwo:String,
    city:String,
    state:String,
    zip:String,
    country:String,
}, {timestamps:true});

export const Contact = mongoose.model("Contact", contactSchema);