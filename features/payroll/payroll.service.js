import {Employee} from "../employee/employee.schema.js";
import {Payroll} from "./payroll.schema.js";
import {BulkPayroll} from "./bulkPayroll.schema.js";
import mongoose from "mongoose";
import {format} from "date-fns";
import {sendPayslipEmail} from "../../util/mailTemplate.js";
import {sendNotification} from "../../config/oneSignal.js";


export const createSinglePayroll = async (id, data) => {
    const payChecks = await Payroll.findOne({empId: id, period: data.period});
    if (payChecks) {
        throw {status: 400, message: 'PayCheck Already Generated for the current Period'};
    }

    const empData = await Employee.findById(id)
        .populate('currentContract');

    if (!empData) {
        throw {status: 400, message: 'Employee Not Found'};
    }

    if (!empData.currentContract) {
        throw {status: 400, message: 'Employee does not have an active contract.'};
    }

    const basicSalary = empData.currentContract.basicSalary;
    const totalAllowance = calculateTotal(data.allowance);
    const totalDeduction = calculateTotal(data.deduction);
    const salary = basicSalary + totalAllowance - totalDeduction;

    const payrollData = new Payroll({
        deduction: totalDeduction,
        allowance: totalAllowance,
        netSalary: salary,
        empId: id,
        basicSalary,
        deductionTypes: data.deduction,
        allowanceTypes: data.allowance,
        status: "Paid",
        period: data.period
    });
    const result = await payrollData.save();
    const getData =await Payroll.findById(result._id)
        .populate({
            path: "empId",
            populate: {
                path: "currentContract",
            }
        })
    await sendPayslipEmail(getData);
    const notification = new Notification({
        title:`Pay Slip for ${data.period}`,
        message:"test",
        empId:empData_id
    })

    await notification.save();

    await sendNotification(notification);

    return result
}

export const generateBulkPayroll = async (dataArray, period, designation) => {
    const bulkPayroll = new BulkPayroll({
        status: "Processing",
        totalRecords: dataArray.length,
        successCount: 0,
        failedCount: 0,
        designation,
        successEntries: [],
        failedEntries: [],
        period
    });

    await bulkPayroll.save();

    await Promise.all(
        dataArray.map(async (data) => {
            try {
                const payroll = await createSinglePayroll(data.empId, data);

                bulkPayroll.successEntries.push({
                    empId: data.empId,
                    payrollId: payroll._id
                });
                bulkPayroll.successCount += 1;
            } catch (error) {
                bulkPayroll.failedEntries.push({
                    empId: data.empId,
                    reason: error.message || "Unknown error"
                });
                bulkPayroll.failedCount += 1;
            }
        })
    );

    bulkPayroll.status = bulkPayroll.successCount >= 1 ? "Generated" : "Failed";
    await bulkPayroll.save();

    return bulkPayroll;
};

export const generatePayRun = async (data) => {
    const designationIdToMatch = new mongoose.Types.ObjectId(data.designationId);
    const empData = await Employee.find({
        currentContract: {$type: "objectId"}
    }).populate({
        path: "currentContract",
    });
    const filteredEmpData = empData.filter(emp => emp?.currentContract?.designationId?.equals(designationIdToMatch));

    if (filteredEmpData.length === 0) {
        throw {status: 400, message: "Couldn't find any employees with the specified designation"};
    }
    const formatArray = filteredEmpData.map(item => ({
        empId: item._id,
        period: data.period,
        deduction: data.deduction,
        allowance: data.allowance
    }));

    return generateBulkPayroll(formatArray, data.period, data.designationId);
}

export const summeryPayroll = async (data) => {
    const page = parseInt(data.page, 10) || 1;
    const limit = parseInt(data.limit, 10) || 10;
    const requestedPeriod = data.period;

    const currentPeriod = format(new Date(), 'MMM yyyy');

    let payroll = await Payroll.find()
        .populate({
            path: "empId",
            populate: {
                path: "currentContract",
            }
        })
        .sort({ createAt: -1 });

    let periods = [...new Set(payroll.map(record => record.period))];

    if (requestedPeriod && !periods.includes(requestedPeriod)) {
        return { message: `Requested period '${requestedPeriod}' is not available` };
    }

    let selectedPeriod = requestedPeriod || (periods.includes(currentPeriod) ? currentPeriod : periods[0]) || null;

    if (!selectedPeriod) {
        return { message: "No payroll data available" };
    }
    let filteredPayroll = payroll.filter(record => record.period === selectedPeriod);

    const periodIndex = periods.indexOf(selectedPeriod);
    const previousPeriod = periods[periodIndex + 1] || null;
    const nextPeriod = periods[periodIndex - 1] || null;

    const startIndex = (page - 1) * limit;
    const paginatedData = filteredPayroll.slice(startIndex, startIndex + limit);
    const totalPages = Math.ceil(filteredPayroll.length / limit);

    return {
        period: selectedPeriod,
        totalRecords: filteredPayroll.length,
        totalPages,
        data: paginatedData,
        nextPeriod,
        previousPeriod
    };
};

export const sendReceiptEmail =async (id)=>{
    const payroll =await Payroll.findById(id)
        .populate({
            path: "empId",
            populate: {
                path: "currentContract",
            }
        });
    return await sendPayslipEmail(payroll);
}

function calculateTotal(data) {
    let total = 0;
    for (let item of data) {
        total += item.amount;
    }
    return total;
}