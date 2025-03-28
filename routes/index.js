import leaveTypeRoute from "../features/leaveType/leaveType.route.js";
import officeShiftRoute from "../features/officeShift/officeShift.route.js";
import designationRoute from "../features/designation/designation.route.js";
import departmentRoute from "../features/department/department.route.js";
import holidayRoute from "../features/holiday/holiday.route.js";
import contactRoute from "../features/contact/contact.route.js";
import branchRoute from "../features/branch/branch.route.js";
import authRoute from "../features/auth/auth.route.js";
import leaveRoute from "../features/leave/leave.route.js";
import employeeRoute from "../features/employee/employee.route.js";
import contractRoute from "../features/employeeContract/contract.route.js";
import paymentProfileRoute from "../features/paymentProfile/paymentProfile.route.js";
import attendanceRoute from "../features/attendance/attendance.route.js";
import locationRoute from "../features/location/location.route.js";
import payrollRoute from "../features/payroll/payroll.route.js";
import settingRoute from "../features/setting/setting.route.js";
import predictRoute from "../features/prediction/predict.router.js";

export default {
    leaveTypes: leaveTypeRoute,
    officeShifts: officeShiftRoute,
    designations: designationRoute,
    departments: departmentRoute,
    holidays: holidayRoute,
    contacts: contactRoute,
    branches: branchRoute,
    employees: employeeRoute,
    auth: authRoute,
    leave: leaveRoute,
    contract: contractRoute,
    paymentProfile: paymentProfileRoute,
    attendances: attendanceRoute,
    locations: locationRoute,
    payroll: payrollRoute,
    setting: settingRoute,
    predict: predictRoute
}