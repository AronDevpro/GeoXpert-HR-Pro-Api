import mongoose, {Mongoose} from "mongoose";

const performanceSchema = new mongoose.Schema({
    score:{type:Number,required: true},
    month:{type:String,required: true},
    performBy:{type:String,required: false},
    remark:String,
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
},{ timestamps: true });

export const Performance = Mongoose.model('Performance', performanceSchema);