import {Attendance} from "./attendance.schema.js";
import {Contracts} from "../employeeContract/contract.schema.js";
import {Holiday} from "../holiday/holiday.schema.js";
import {isPointWithinRadius} from "geolib";
import {Employee} from "../employee/employee.schema.js";
import {OfficeShift} from "../officeShift/officeShift.schema.js";
import mongoose from "mongoose";
import {
    addMonths,
    differenceInBusinessDays,
    endOfMonth,
    endOfWeek,
    startOfMonth,
    startOfWeek,
    subMonths,
    subWeeks
} from "date-fns";

// get attendance by id
export const getEmpAttendanceById = async (id, data) => {
    if (!id) {
        throw {status: 400, message: 'Employee ID is required'};
    }
    try {
        const page = parseInt(data.page, 10) || 1;
        const limit = parseInt(data.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const totalSize = await Attendance.countDocuments({empId: id});
        const list = await Attendance.find({empId: id})
            .populate('empId')
            .skip(startIndex)
            .limit(limit)
            .sort({createdAt: -1});
        if (list.length === 0) {
            throw {status: 404, message: 'Attendance records not found'};
        }
        const totalPages = Math.ceil((totalSize || 0) / limit);
        return {totalPages, content: list};
    } catch (error) {
        if (error.status) throw error;
        throw {status: 500, message: `Error fetching attendance: ${error.message}`};
    }
}

// get attendance by branch id
export const getEmpAttendanceByBranchId = async (id, data) => {
    if (!id) {
        throw {status: 400, message: 'Branch ID is required'};
    }
    try {
        const search = data.search || '';
        const branchId = new mongoose.Types.ObjectId(id);
        const page = parseInt(data.page, 10) || 1;
        const limit = parseInt(data.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const list = await Attendance.find()
            .populate('empId')
            .sort({createdAt: -1})
            .lean();

        if (list.length === 0) {
            throw {status: 404, message: 'Attendance records not found'};
        }
        let filteredBranch = list.filter(emp => emp?.empId?.branch?.equals(branchId));

        // Filter by search (firstName or lastName)
        if (search) {
            filteredBranch = filteredBranch.filter(emp => {
                const firstName = emp?.empId?.firstName?.toLowerCase() || '';
                const lastName = emp?.empId?.lastName?.toLowerCase() || '';
                return firstName.includes(search) || lastName.includes(search);
            });
        }

        if (filteredBranch.length === 0) {
            throw {status: 400, message: "Couldn't find any employees with the specified branch"};
        }
        const paginatedResults = filteredBranch.slice(startIndex, startIndex + limit);
        const totalPages = Math.ceil((filteredBranch.length || 0) / limit);
        return {totalPages, content: paginatedResults};
    } catch (error) {
        if (error.status) throw error;
        throw {status: 500, message: `Error fetching attendance: ${error.message}`};
    }
}

// create attendance record
export const createAttendanceRecord = async (id, data) => {
    if (!id) {
        throw {status: 400, message: 'Employee ID is required'};
    }
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

    const attendanceRecord = await Attendance.findOne({
        empId: id,
        createdAt: {$gte: startOfDay, $lte: endOfDay},
    });

    // if (attendanceRecord) {
    //     throw { status: 400, message: "You're already Attended Today" };
    // }

    const isHoliday = await Holiday.findOne({
        startDate: {$lte: endOfDay},
        endDate: {$gte: startOfDay},
    });

    if (isHoliday) {
        throw new Error('Clock-in not allowed on holidays.');
    }

    const emp = await Employee.findById(id)
        .populate({
            path: 'currentContract',
            populate: {path: 'officeShift', model: 'OfficeShift'},
        })
        .populate('branch');

    if (!emp) {
        throw {status: 400, message: 'Employee Not Found'};
    }

    if (!emp.currentContract || !emp.currentContract.officeShift) {
        throw new Error('Employee does not have an assigned shift.');
    }

    const isLate = isTimeLate(data.clockInTime, emp.currentContract.officeShift.startTime);

    // Validate geolocation
    const isWithinRadius = isPointWithinRadius(
        { latitude: data.latitude, longitude: data.longitude }, // User's location
        { latitude: emp.branch.latitude, longitude: emp.branch.longitude }, // Office location
        emp.branch.radius // Radius in meters
    );
    if (!isWithinRadius) {
        throw new Error("You're out of the office location range.");
    }

    const finalizeData = new Attendance({
        empId: id,
        clockIn: {
            time: data.clockInTime,
            isLate,
            longitude: data.longitude,
            latitude: data.latitude,
        }
    });

    return await finalizeData.save();
}

// update attendance record
export const updateAttendanceRecord = async (id, data) => {
    if (!id) {
        throw {status: 400, message: 'Employee ID is required'};
    }

    const currentDate = new Date();

    const attendanceRecord = await Attendance.findOne({
        empId: id,
        createdAt: {
            $gte: new Date(currentDate.setHours(0, 0, 0, 0)), // Start of day
            $lte: new Date(currentDate.setHours(23, 59, 59, 999)), // End of day
        },
    });

    if (!attendanceRecord) {
        throw {status: 400, message: 'No attendance record found for today.'};
    }
    // if (attendanceRecord?.clockOut?.time) {
    //     throw { status: 400, message: 'Already Clock-out' };
    // }

    const emp = await Employee.findById(id)
        .populate({
            path: 'currentContract',
            populate: {path: 'officeShift', model: 'OfficeShift'},
        })
        .populate('branch');
    if (!emp) {
        throw {status: 400, message: 'Employee not found'};
    }
    if (!emp.currentContract || !emp.currentContract.officeShift) {
        throw {status: 400, message: 'Employee does not have an assigned shift.'};
    }

    const clockOutTime = data.clockOutTime;
    const shiftEndTime = emp.currentContract.officeShift.endTime;

    const totalHoursWorked = calculateHoursWorked(attendanceRecord.clockIn.time, clockOutTime);
    const earlyLeave = isEarlyLeave(clockOutTime, shiftEndTime);

    attendanceRecord.clockOut.time = clockOutTime;
    attendanceRecord.totalHours = totalHoursWorked;
    attendanceRecord.clockOut.isEarlyLeaving = earlyLeave;
    attendanceRecord.clockOut.latitude = data.latitude;
    attendanceRecord.clockOut.longitude = data.latitude;
    attendanceRecord.clockOut.status = "Normal";

    return await attendanceRecord.save();
};

// get attendance rate
// export const AttendanceRate = async (empId) => {
//     try {
//         const now = new Date();
//
//         // Define start and end dates for the current and previous week
//         const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 }); // Monday as start
//         const endOfCurrentWeek = endOfWeek(now, { weekStartsOn: 1 });
//         const startOfLastWeek = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
//         const endOfLastWeek = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
//
//         // Fetch attendance data for current and previous week
//         const currentWeekAttendance = await Attendance.aggregate([
//             { $match: { empId: new mongoose.Types.ObjectId(empId), createdAt: { $gte: startOfCurrentWeek, $lte: endOfCurrentWeek } } },
//             { $group: { _id: null, totalHours: { $sum: "$totalHours" } } }
//         ]);
//
//         const lastWeekAttendance = await Attendance.aggregate([
//             { $match: { empId: new mongoose.Types.ObjectId(empId), createdAt: { $gte: startOfLastWeek, $lte: endOfLastWeek } } },
//             { $group: { _id: null, totalHours: { $sum: "$totalHours" } } }
//         ]);
//
//         // Extract total hours
//         const currentWeekHours = currentWeekAttendance.length > 0 ? currentWeekAttendance[0].totalHours : 0;
//         const lastWeekHours = lastWeekAttendance.length > 0 ? lastWeekAttendance[0].totalHours : 0;
//
//         // Calculate percentage change
//         let percentageChange = 0;
//         if (lastWeekHours > 0) {
//             percentageChange = ((currentWeekHours - lastWeekHours) / lastWeekHours) * 100;
//         } else if (currentWeekHours > 0) {
//             percentageChange = 100; // If no hours last week but present this week
//         }
//
//         return {
//             empId,
//             currentWeekHours,
//             lastWeekHours,
//             percentageChange: percentageChange.toFixed(2) + "%",
//         };
//     } catch (error) {
//         throw new Error("Unable to fetch attendance rate");
//     }
// };
export const AttendanceRate = async (empId) => {
    try {
        const now = new Date();

        // Get start and end dates for the current and previous month
        const startOfCurrentMonth = startOfMonth(now);
        const endOfCurrentMonth = endOfMonth(now);
        const startOfLastMonth = startOfMonth(subMonths(now, 1));
        const endOfLastMonth = endOfMonth(subMonths(now, 1));

        // Calculate total working days in the month (excluding weekends)
        const totalWorkDaysCurrent = differenceInBusinessDays(endOfCurrentMonth, startOfCurrentMonth) + 1;
        const totalWorkDaysLast = differenceInBusinessDays(endOfLastMonth, startOfLastMonth) + 1;

        // Assume an 8-hour workday
        const maxPossibleHoursCurrent = totalWorkDaysCurrent * 8;
        const maxPossibleHoursLast = totalWorkDaysLast * 8;

        // Fetch attendance data for current and previous month
        const currentMonthAttendance = await Attendance.aggregate([
            {
                $match: {
                    empId: new mongoose.Types.ObjectId(empId),
                    createdAt: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth }
                }
            },
            { $group: { _id: null, totalHours: { $sum: "$totalHours" } } }
        ]);

        const lastMonthAttendance = await Attendance.aggregate([
            {
                $match: {
                    empId: new mongoose.Types.ObjectId(empId),
                    createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
                }
            },
            { $group: { _id: null, totalHours: { $sum: "$totalHours" } } }
        ]);

        // Extract total hours worked
        const currentMonthHours = currentMonthAttendance.length > 0 ? currentMonthAttendance[0].totalHours : 0;
        const lastMonthHours = lastMonthAttendance.length > 0 ? lastMonthAttendance[0].totalHours : 0;

        // Calculate attendance rate for current month
        const attendanceRateCurrent = maxPossibleHoursCurrent > 0 ? (currentMonthHours / maxPossibleHoursCurrent) * 100 : 0;

        // Calculate attendance rate for last month
        const attendanceRateLast = maxPossibleHoursLast > 0 ? (lastMonthHours / maxPossibleHoursLast) * 100 : 0;

        // Calculate the percentage change in attendance rate
        const percentageChange = attendanceRateLast > 0 ? ((attendanceRateCurrent - attendanceRateLast) / attendanceRateLast) * 100
            : attendanceRateCurrent > 0 ? 100 : 0;

        return {
            empId,
            attendanceRate: attendanceRateCurrent.toFixed(2), // Attendance rate for this month
            comparisonRate: percentageChange.toFixed(2), // Month-over-month change
        };
    } catch (error) {
        console.error("Error fetching attendance rate:", error);
        throw new Error("Unable to fetch attendance rate");
    }
};

export const getBranchAttendanceRate = async (branchId) => {
    try {
        const now = new Date();
        const startOfCurrentMonth = startOfMonth(now);
        const startOfNextMonth = startOfMonth(addMonths(now, 1));
        const startOfLastMonth = startOfMonth(subMonths(now, 1));

        // Fetch all employees in the branch
        const employees = await Employee.find({
            branch: new mongoose.Types.ObjectId(branchId),
            status: "Active"
        }).select("_id");

        const employeeIds = employees.map(emp => emp._id);

        // Calculate attendance for current month
        const currentMonthAttendance = await Attendance.aggregate([
            {
                $match: {
                    empId: { $in: employeeIds },
                    createdAt: { $gte: startOfCurrentMonth, $lt: startOfNextMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    totalHours: { $sum: "$totalHours" }
                }
            }
        ]);

        // Calculate attendance for last month
        const lastMonthAttendance = await Attendance.aggregate([
            {
                $match: {
                    empId: { $in: employeeIds },
                    createdAt: { $gte: startOfLastMonth, $lt: startOfCurrentMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    totalHours: { $sum: "$totalHours" }
                }
            }
        ]);

        // Assume standard working hours for a month
        const standardWorkingHours = employees.length * 160;

        // Current and last month hours
        const currentMonthHours = currentMonthAttendance[0] ? currentMonthAttendance[0].totalHours : 0;
        const lastMonthHours = lastMonthAttendance[0] ? lastMonthAttendance[0].totalHours : 0;

        // Calculate attendance rates
        const currentMonthRate = (currentMonthHours / standardWorkingHours) * 100;
        const lastMonthRate = (lastMonthHours / standardWorkingHours) * 100;

        // Calculate percentage change
        const percentageChange = lastMonthRate > 0
            ? ((currentMonthRate - lastMonthRate) / lastMonthRate) * 100
            : currentMonthRate > 0 ? 100 : 0;

        return {
            branchId,
            totalAttendanceRateCurrentMonth: currentMonthRate.toFixed(2),
            totalAttendanceRateLastMonth: lastMonthRate.toFixed(2),
            comparisonRate: percentageChange.toFixed(2)
        };

    } catch (error) {
        throw new Error("Unable to fetch attendance rate");
    }
};

function convertToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function isTimeLate(clockInTime, shiftStartTime) {
    const clockInMinutes = convertToMinutes(clockInTime);
    const shiftStartMinutes = convertToMinutes(shiftStartTime);
    return clockInMinutes > shiftStartMinutes;
}

function isEarlyLeave(clockOutTime, shiftEndTime) {
    const clockOutMinutes = convertToMinutes(clockOutTime);
    const shiftEndMinutes = convertToMinutes(shiftEndTime);
    return clockOutMinutes < shiftEndMinutes;
}

function calculateHoursWorked(startTime, endTime) {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    const totalMinutesWorked = endTotalMinutes - startTotalMinutes;

    return (totalMinutesWorked / 60).toFixed(2);
}