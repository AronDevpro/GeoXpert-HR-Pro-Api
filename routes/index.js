import leaveTypeRoute from "./leaveTypeRoute.js";
import officeShiftRoute from "./officeShiftRoute.js";
import designationRoute from "./designationRoute.js";
import departmentRoute from "./departmentRoute.js";
import holidayRoute from "./holidayRoute.js";
import contactRoute from "./contactRoute.js";
import branchRoute from "./branchRoute.js";
import employeeRoute from "./employeeRoute.js";
import authRoute from "./authRoute.js";

export default {
    leaveTypes:leaveTypeRoute,
    officeShifts:officeShiftRoute,
    designations:designationRoute,
    departments:departmentRoute,
    holidays:holidayRoute,
    contacts:contactRoute,
    branches:branchRoute,
    employees:employeeRoute,
    auth:authRoute,
}