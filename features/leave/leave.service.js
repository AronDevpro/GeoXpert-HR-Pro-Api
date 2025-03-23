import {Leave} from "./leave.schema.js";
import mongoose from "mongoose";
import {addMonths, differenceInBusinessDays, endOfMonth, startOfMonth, subMonths} from "date-fns";
import {Employee} from "../employee/employee.schema.js";
import {sendNotification} from "../../config/oneSignal.js";

export const GetAllLeavesById = async (id, data) => {
    try {
        const page = parseInt(data.page, 10) || 1;
        const limit = parseInt(data.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const totalSize = await Leave.countDocuments({employee: id});

        const list = await Leave.find({employee: id})
            .skip(startIndex)
            .limit(limit)
            .populate('employee')
            .sort({createdAt: -1});
        const totalPages = Math.ceil((totalSize || 0) / limit);
        return {totalPages, content: list};
    } catch (error) {
        throw new Error(`Error fetching all records: ${error.message}`);
    }
};

export const GetPendingReqByBranchId = async (id, data) => {
    try {
        const branchId = new mongoose.Types.ObjectId(id);
        const search = data.search || '';
        const page = parseInt(data.page, 10) || 1;
        const limit = parseInt(data.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const statusConditions = [
            {status: {$regex: '^PENDING$', $options: 'i'}},
        ];

        const searchConditions = search
            ? [
                {empId: {$regex: search, $options: 'i'}},
                {firstName: {$regex: search, $options: 'i'}},
                {lastName: {$regex: search, $options: 'i'}},
            ]
            : [];

        const query = {
            $and: [
                {$or: statusConditions},
                ...(searchConditions.length > 0 ? [{$or: searchConditions}] : [])
            ]
        };

        const list = await Leave.find(query)
            .skip(startIndex)
            .limit(limit)
            .populate('employee')
            .sort({createdAt: -1});

        let filteredBranch = list.filter(emp => emp?.employee?.branch?.equals(branchId));

        // Filter by search (firstName or lastName)
        if (search) {
            filteredBranch = filteredBranch.filter(emp => {
                const firstName = emp?.employee?.firstName?.toLowerCase() || '';
                const lastName = emp?.employee?.lastName?.toLowerCase() || '';
                return firstName.includes(search) || lastName.includes(search);
            });
        }

        if (filteredBranch.length === 0) {
            throw {status: 400, message: "Couldn't find any leave req with the specified branch"};
        }
        const paginatedResults = filteredBranch.slice(startIndex, startIndex + limit);
        const totalPages = Math.ceil((filteredBranch.length || 0) / limit);
        return {totalPages, content: paginatedResults};
    } catch (error) {
        throw new Error(`Error fetching all records: ${error.message}`);
    }
};

export const getMonthlyLeaveRate = async (empId) => {
    try {
        const now = new Date();

        // Define start and end dates for the current and previous month
        const startOfCurrentMonth = startOfMonth(now);
        const endOfCurrentMonth = endOfMonth(now);
        const startOfLastMonth = startOfMonth(subMonths(now, 1));
        const endOfLastMonth = endOfMonth(subMonths(now, 1));

        // Calculate total working days in the month (excluding weekends)
        const totalWorkDaysCurrent = differenceInBusinessDays(endOfCurrentMonth, startOfCurrentMonth) + 1;
        const totalWorkDaysLast = differenceInBusinessDays(endOfLastMonth, startOfLastMonth) + 1;

        // Fetch leave data for current and previous month (only approved leaves)
        const currentMonthLeaves = await Leave.find({
            employee: new mongoose.Types.ObjectId(empId),
            status: "Approved",
            startDate: {$lte: endOfCurrentMonth},
            endDate: {$gte: startOfCurrentMonth}
        });

        const lastMonthLeaves = await Leave.find({
            employee: new mongoose.Types.ObjectId(empId),
            status: "Approved",
            startDate: {$lte: endOfLastMonth},
            endDate: {$gte: startOfLastMonth}
        });

        // Function to calculate total leave days (including half-days)
        const calculateLeaveDays = (leaves, monthStart, monthEnd) => {
            let totalLeaveDays = 0;
            for (const leave of leaves) {
                let leaveStart = leave.startDate < monthStart ? monthStart : leave.startDate;
                let leaveEnd = leave.endDate > monthEnd ? monthEnd : leave.endDate;
                let leaveDays = differenceInBusinessDays(leaveEnd, leaveStart) + 1;
                totalLeaveDays += leave.isHalfDay ? leaveDays * 0.5 : leaveDays;
            }
            return totalLeaveDays;
        };

        // Get total leave days for current and last month
        const totalLeaveDaysCurrent = calculateLeaveDays(currentMonthLeaves, startOfCurrentMonth, endOfCurrentMonth);
        const totalLeaveDaysLast = calculateLeaveDays(lastMonthLeaves, startOfLastMonth, endOfLastMonth);

        // Calculate leave rate for current and last month
        const leaveRateCurrent = totalWorkDaysCurrent > 0 ? (totalLeaveDaysCurrent / totalWorkDaysCurrent) * 100 : 0;
        const leaveRateLast = totalWorkDaysLast > 0 ? (totalLeaveDaysLast / totalWorkDaysLast) * 100 : 0;

        // Calculate percentage change in leave rate
        const percentageChange = leaveRateLast > 0 ? ((leaveRateCurrent - leaveRateLast) / leaveRateLast) * 100
            : leaveRateCurrent > 0 ? 100 : 0;

        return {
            empId,
            leaveRate: leaveRateCurrent.toFixed(2), // Leave rate for this month
            comparisonRate: percentageChange.toFixed(2), // Month-over-month change
        };
    } catch (error) {
        throw new Error("Unable to fetch leave rate");
    }
};

export const getBranchLeaveRate = async (branchId) => {
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

        // Calculate leave days for current month
        const currentMonthLeaves = await Leave.aggregate([
            {
                $match: {
                    employee: {$in: employeeIds},
                    status: {$in: ["Active", "System"]},
                    startDate: {$gte: startOfCurrentMonth, $lt: startOfNextMonth}
                }
            },
            {
                $group: {
                    _id: null,
                    totalLeaveDays: {
                        $sum: {
                            $cond: {
                                if: {$eq: ["$isHalfDay", true]},
                                then: 0.5,
                                else: 1
                            }
                        }
                    }
                }
            }
        ]);

        // Calculate leave days for last month
        const lastMonthLeaves = await Leave.aggregate([
            {
                $match: {
                    employee: {$in: employeeIds},
                    status: {$in: ["Active", "System"]},
                    startDate: {$gte: startOfLastMonth, $lt: startOfCurrentMonth}
                }
            },
            {
                $group: {
                    _id: null,
                    totalLeaveDays: {
                        $sum: {
                            $cond: {
                                if: {$eq: ["$isHalfDay", true]},
                                then: 0.5,
                                else: 1
                            }
                        }
                    }
                }
            }
        ]);

        // Assume 20 working days per month
        const totalWorkingDays = employees.length * 20;

        // Current and last month leave days
        const currentMonthLeaveDays = currentMonthLeaves[0] ? currentMonthLeaves[0].totalLeaveDays : 0;
        const lastMonthLeaveDays = lastMonthLeaves[0] ? lastMonthLeaves[0].totalLeaveDays : 0;

        // Calculate leave rates
        const currentMonthLeaveRate = (currentMonthLeaveDays / totalWorkingDays) * 100;
        const lastMonthLeaveRate = (lastMonthLeaveDays / totalWorkingDays) * 100;

        // Calculate percentage change
        const percentageChange = lastMonthLeaveRate > 0
            ? ((currentMonthLeaveRate - lastMonthLeaveRate) / lastMonthLeaveRate) * 100
            : currentMonthLeaveRate > 0 ? 100 : 0;

        return {
            branchId,
            totalLeaveRateCurrentMonth: currentMonthLeaveRate.toFixed(2),
            totalLeaveRateLastMonth: lastMonthLeaveRate.toFixed(2),
            comparisonRate: percentageChange.toFixed(2)
        };

    } catch (error) {
        throw new Error("Unable to fetch leave rate");
    }
};

export const updateLeave = async (id, data) => {
    try {
        const item = await Leave.findByIdAndUpdate(id, data, {new: true}).populate("employee");
        if (!item) throw new Error('Item not found');

        const notification = {
            title: `Your Leave Request has been ${data.status}`,
            message: data.status === "Approved" ? "Enjoy your time off! If you have any" +
                " questions, feel free to reach out to HR." : "Please check your leave details or contact your manager for more information.",
            appToken: item?.employee?.appToken,
        }
        await sendNotification(notification);
        return item;
    } catch (error) {
        throw new Error(`Error updating record: ${error.message}`);
    }
};