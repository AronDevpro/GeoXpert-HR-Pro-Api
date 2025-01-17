import mongoose from "mongoose";

const counter = new mongoose.Schema({
    id: { type: String, required: true },
    seq: { type: Number, default: 0 }
},{timestamps:true});

export const Counter = mongoose.model('Counter', counter);