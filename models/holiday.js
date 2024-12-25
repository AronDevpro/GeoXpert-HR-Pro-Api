import mongoose, {Mongoose} from "mongoose";

const holidaySchema = new mongoose.Schema({
    name:{type:String,required: true},
    description:{type:String,required: false},
    isRecurring:{type:Boolean,default:false},
    startDate:{type:Date,required:true},
    endDate:{type:Date,required:true},
    status:{type:String,default:"Active"},
},{timestamps:true});

export const Holiday = mongoose.model('Holiday', holidaySchema);