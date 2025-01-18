import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    code: {type: String, required: true, unique: true},
    description:String,
    status: {type: String, enum:["Active", "Inactive"], default: "Active"},
},{timestamps: true});

export const Department = mongoose.model("Department", departmentSchema);