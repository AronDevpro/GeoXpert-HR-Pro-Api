import mongoose from "mongoose";

const userRoleSchema = new mongoose.Schema({
    name:{type:String,required: true},
    description:String,
    status: {type:String,default:"Active"},
},{timestamps:true});

export const UserRole = mongoose.model("UserRole", userRoleSchema);