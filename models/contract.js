import mongoose, {Mongoose} from "mongoose";

const contractSchema = new mongoose.Schema({
    department:{type: mongoose.Schema.Types.ObjectId, ref: 'department'},
    designation:{type: mongoose.Schema.Types.ObjectId, ref: 'designation'},
    joinDate:{type:Date, default:Date.now,required: true},
    officeShift:{type: mongoose.Schema.Types.ObjectId,ref:"OfficeShift"},
    description:String,
    basicSalary:Number,
    paySlipType:{type:String,required:true,default:"Monthly"},
    status:{type:String,default:"Active"},
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
}, { timestamps: true });

export const Contracts = mongoose.model('Contracts', contractSchema);