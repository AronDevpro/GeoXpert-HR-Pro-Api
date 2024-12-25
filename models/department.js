import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    name: {type: String, required: true},
    code: {type: String, required: true},
    description:String,
},{timestamps: true});

export const Department = mongoose.model("Department", departmentSchema);