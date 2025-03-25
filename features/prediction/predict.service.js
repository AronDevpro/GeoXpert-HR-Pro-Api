import {Employee} from "../employee/employee.schema.js";
import {Leave} from "../leave/leave.schema.js";
import {differenceInDays, differenceInYears} from "date-fns";

export const predictPromotion = async (id) => {
    try {
        if (!id) {
            throw {status: 400, message: 'Employee ID is required'};
        }

        // Fetch employee data
        const emp = await Employee.findById(id)
            .populate('currentContract')
            .populate('contact')
            .exec();

        if (!emp) {
            throw {status: 404, message: 'Employee not found'};
        }

        if (!emp.currentContract) {
            throw {status: 404, message: 'Employee not have contract'};
        }

        // Fetch leave data for the employee
        const leaves = await Leave.find({employee: id, status: "Approved"});

        // Calculate derived features
        const age = differenceInYears(new Date(), emp.dateOfBirth);
        const yearsOfService = differenceInYears(new Date(), emp.currentContract.joinDate);
        const numberOfLeavesTaken = leaves.length;
        const daysSinceStart = differenceInDays(new Date(), emp.currentContract.joinDate);

        // Prepare input data for prediction
        const inputData = {
            Age: age,
            Department: emp.currentContract.department,
            YearsOfService: yearsOfService,
            EducationLevel: emp.qualification.highestEducation || 'Unknown',
            JobTitle: emp.currentContract.designation,
            NumberOfLeavesTaken: numberOfLeavesTaken,
            AttendancePercentage: 100 - (numberOfLeavesTaken / 365) * 100,
            PerformanceRating: 5,
            LeavePercentage: (numberOfLeavesTaken / 365) * 100,
            DaysSinceStart: daysSinceStart,
        };

        const response = await fetch('http://127.0.0.1:7000/promotion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputData),
        });

        if (!response.ok) {
            throw {status: response.status, message: `HTTP error! Status: ${response.status}`};
        }

        // Parse the prediction result
        const result = await response.json();
        const prediction = result.prediction;

        return {
            prediction: prediction[0],
            message: prediction[0] === 1 ? 'Eligible for Promotion' : 'Not Eligible for Promotion',
        };
    } catch (error) {
        if (error.status) throw error;
        throw {status: 500, message: `Error fetching prediction: ${error.message}`};
    }
};

export const predictTurnover = async (id) => {
    try {
        if (!id) {
            throw {status: 400, message: 'Employee ID is required'};
        }

        // Fetch employee data
        const emp = await Employee.findById(id)
            .populate('currentContract')
            .populate('contact')
            .exec();

        if (!emp) {
            throw {status: 404, message: 'Employee not found'};
        }

        if (!emp.currentContract) {
            throw {status: 404, message: 'Employee not have contract'};
        }

        // Fetch leave data for the employee
        const leaves = await Leave.find({employee: id, status: "Approved"});

        // Calculate derived features
        const age = differenceInYears(new Date(), emp.dateOfBirth);
        const yearsOfService = differenceInYears(new Date(), emp.currentContract.joinDate);
        const numberOfLeavesTaken = leaves.length;
        const daysSinceStart = differenceInDays(new Date(), emp.currentContract.joinDate);

        // Prepare input data for prediction
        const inputData = {
            Age: age,
            Department: emp.currentContract.department,
            YearsOfService: yearsOfService,
            EducationLevel: emp.qualification.highestEducation || 'Unknown',
            JobTitle: emp.currentContract.designation,
            NumberOfLeavesTaken: numberOfLeavesTaken,
            AttendancePercentage: 100 - (numberOfLeavesTaken / 365) * 100,
            PerformanceRating: 5,
            LeavePercentage: (numberOfLeavesTaken / 365) * 100,
            DaysSinceStart: daysSinceStart,
        };

        const response = await fetch('http://127.0.0.1:7000/turnover', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputData),
        });

        // console.log(response)

        if (!response.ok) {
            throw {status: response.status, message: `HTTP error! Status: ${response.status}`};
        }

        // Parse the prediction result
        const result = await response.json();
        const prediction = result.prediction;

        return {
            prediction: prediction[0],
            message: prediction[0] === 1 ? 'Employee likely to leave' : 'Employee likely to stay',
        };
    } catch (error) {
        if (error.status) throw error;
        throw {status: 500, message: `Error fetching prediction: ${error.message}`};
    }
};