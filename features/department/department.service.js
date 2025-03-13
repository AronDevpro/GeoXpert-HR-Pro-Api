import {Department} from "./department.schema.js";

export const getTotalDepartmentCount = async ()=>{
    return await Department.countDocuments();
}