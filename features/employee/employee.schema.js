import mongoose from "mongoose";

const employee = new mongoose.Schema({
    empId: { type: String, required: true },
    firstName: {type: String, required: true},
    lastName: String,
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    username: {type: String, required: true},
    gender:String,
    maritalStatus:String,
    dateOfBirth:Date,
    bloodGroup:String,
    citizenship:String,
    nationality:String,
    nic:String,
    religion:String,
    contact:{type:mongoose.Schema.Types.ObjectId,ref:"Contact"},
    status:{type:String,required:true,default:"Active"},
},{timestamps:true});

employee.set('toJSON', {
    transform: (document,returnedObject) => {
        returnedObject.id  =  returnedObject._id.toString()
        delete returnedObject.__v
        delete returnedObject.password  //do not reveal password
        delete returnedObject.createdAt
        delete returnedObject.updatedAt
    }
})

export const Employee = mongoose.model('Employee', employee);