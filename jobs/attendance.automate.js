import {Attendance} from "../features/attendance/attendance.schema.js";
import {Holiday} from "../features/holiday/holiday.schema.js";
import {Employee} from "../features/employee/employee.schema.js";
import {Leave} from "../features/leave/leave.schema.js";
import cron from "node-cron";
import {Cron} from "../features/cron/cron.schema.js";

export const automaticallyAddLeave = async (id, emp) => {
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

    const attendanceRecord = await Attendance.findOne({
        empId: id,
        createdAt: {$gte: startOfDay, $lte: endOfDay},
    });

    if (attendanceRecord) {
        return {status: 400, message: "Employee has Attended Today"};
    }

    const isHoliday = await Holiday.findOne({
        startDate: {$lte: endOfDay},
        endDate: {$gte: startOfDay},
    });

    if (isHoliday) {
        return {status: 400, message: "Clock-in not allowed on holidays."};
    }
    const isLeave = await Leave.findOne({
        employee: id,
        startDate: {$lte: endOfDay},
        endDate: {$gte: startOfDay},
    })
    if (isLeave) {
        return {status: 400, message: "Employee is on leave"};
    }

    if (!emp) {
        throw {status: 400, message: 'Employee Not Found'};
    }

    if (!emp.currentContract || !emp.currentContract.officeShift) {
        throw new Error('Employee does not have an assigned shift.');
    }

    const finalizeData = new Attendance({
        empId: id,
        status: "Leave"
    });
    await finalizeData.save();
    const addLeaveData = new Leave({
        employee: emp._id,
        leaveType: "Unscheduled leave",
        startDate: currentDate,
        endDate: currentDate,
        status: "System"
    })
    await addLeaveData.save();
}

// Fetch all active employees
export const getAllEmployees = async () => {
    const query = {
        $and: [
            {status: {$regex: "^ACTIVE$", $options: "i"}},
            {currentContract: {$ne: null}},
        ],
    };
    return await Employee.find(query).populate({
        path: 'currentContract',
    })
        .populate('branch');
};

// Automate the leave marking process
const automateTask = async () => {
    const startTime = Date.now();

    const employees = await getAllEmployees();
    if (!employees.length) {
        await Cron.create({
            name: "Auto Leave Job",
            status: "Success",
            reason: "No employees found",
            executedAt: new Date(),
            duration: Date.now() - startTime,
        });
        return;
    }

    for (const emp of employees) {
        try {
            await automaticallyAddLeave(emp._id, emp);
            await Cron.create({
                name: "Auto Leave Job",
                status: "Success",
                executedAt: new Date(),
                duration: Date.now() - startTime,
            });
        } catch (error) {
            await Cron.create({
                name: "Auto Leave Job",
                status: "Fail",
                reason: error.message,
                executedAt: new Date(),
                duration: Date.now() - startTime,
            });
        }
    }
};

// automated job
cron.schedule("32 11 * * 1-5", async () => {
    console.log("Automated Attendance Leave job started")
    await automateTask();
    console.log("Automated Attendance Leave job closed")
}, {
    timezone: "Asia/Colombo"
});