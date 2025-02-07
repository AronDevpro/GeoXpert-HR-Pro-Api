import {Attendance} from "./attendance.schema.js";
import {Contracts} from "../employeeContract/contract.schema.js";
import {Holiday} from "../holiday/holiday.schema.js";
import {isPointWithinRadius} from "geolib";
import {Employee} from "../employee/employee.schema.js";
import {OfficeShift} from "../officeShift/officeShift.schema.js";


export const getEmpAttendanceById=async (id) => {
    if (!id) {
        throw { status: 400, message: 'Employee ID is required' };
    }

    try {
        const attendance = await Attendance.find({ employeeId: id });
        if (attendance.length === 0) {
            throw { status: 404, message: 'Attendance records not found' };
        }
        return attendance;
    } catch (error) {
        if (error.status) throw error;
        throw { status: 500, message: `Error fetching attendance: ${error.message}` };
    }
}

export const createAttendanceRecord = async (id, data)=>{
    console.log(id)
    if (!id) {
        throw { status: 400, message: 'Employee ID is required' };
    }
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

    const attendanceRecord = await Attendance.findOne({
        empId: id,
        createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    // if (attendanceRecord) {
    //     throw { status: 400, message: "You're already Attended Today" };
    // }

    const isHoliday = await Holiday.findOne({
        startDate: { $lte: endOfDay },
        endDate: { $gte: startOfDay },
    });

    if (isHoliday) {
        throw new Error('Clock-in not allowed on holidays.');
    }

    const emp = await Employee.findById(id)
        .populate({
            path: 'currentContract',
            populate: { path: 'officeShift', model: 'OfficeShift' },
        })
        .populate('branch');

    if (!emp) {
        throw { status: 400, message: 'Employee Not Found' };
    }

    if (!emp.currentContract || !emp.currentContract.officeShift) {
        throw new Error('Employee does not have an assigned shift.');
    }

    const isLate = isTimeLate(data.clockInTime, emp.currentContract.officeShift.startTime);

    // Validate geolocation
    // const isWithinRadius = isPointWithinRadius(
    //     { latitude: data.latitude, longitude: data.longitude }, // User's location
    //     { latitude: emp.branch.latitude, longitude: emp.branch.longitude }, // Office location
    //     emp.branch.radius // Radius in meters
    // );
    // if (!isWithinRadius) {
    //     throw new Error("You're out of the office location range.");
    // }

    const finalizeData = new Attendance({
        empId:id,
        clockIn:{
            time: data.clockInTime,
            isLate,
            longitude:data.longitude,
            latitude:data.latitude,
        }
    });

    return await finalizeData.save();
}

export const updateAttendanceRecord = async (id, data) => {
    if (!id) {
        throw { status: 400, message: 'Employee ID is required' };
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
        throw { status: 400, message: 'No attendance record found for today.' };
    }

    const emp = await Employee.findById(id)
        .populate({
            path: 'currentContract',
            populate: { path: 'officeShift', model: 'OfficeShift' },
        })
        .populate('branch');
    if (!emp) {
        throw { status: 400, message: 'Employee not found' };
    }
    if (!emp.currentContract || !emp.currentContract.officeShift) {
        throw { status: 400, message: 'Employee does not have an assigned shift.' };
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

    return await attendanceRecord.save();
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