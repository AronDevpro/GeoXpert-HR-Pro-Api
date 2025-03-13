import {Contact} from "../contact/contact.schema.js";
import {Employee} from "./employee.schema.js";
import helper from "../../util/helper.js";
import {sendUserRegisterEmail} from "../../util/mailTemplate.js";
import {PaymentProfile} from "../paymentProfile/paymentProfile.schema.js";
import {Counter} from "./counter.schema.js";
import {addMonths, startOfMonth, subMonths} from "date-fns";
import mongoose from "mongoose";

// Create a new document
export const createEmployee = async (data) => {
    try {
        const existingEmployee = await Employee.findOne({email: data.email});
        if (existingEmployee) {
            throw new Error('Email already exists');
        }

        // save contact
        const contactData = new Contact(data.contact);
        const savedContact = await contactData.save();

        // save Payment profile
        const paymentProfile = new PaymentProfile(data.paymentProfile);
        const SavedPaymentProfile = await paymentProfile.save();

        const hashPassword = await helper.hashPassword(data.password);
        const employeeId = await generateEmployeeId();

        const empData = new Employee({
            ...data,
            empId: employeeId,
            contact: savedContact._id,
            password: hashPassword,
            paymentProfile: SavedPaymentProfile._id
        })
        const user = await empData.save();

        await sendUserRegisterEmail(user);
        return user;
    } catch (error) {
        throw new Error(`Error Creating Employee: ${error.message}`);
    }
};

// Update a document by ID
export const updateEmployee = async (id, data) => {
    try {
        const employee = await Employee.findByIdAndUpdate(id, data, {new: true});
        if (!employee) throw new Error('Employee not found');

        if (data.contact && data.contact._id) {
            await Contact.findByIdAndUpdate(data.contact._id, data.contact, {new: true});
        } else if (data.contact) {
            const newContact = new Contact(data.contact);
            const savedContact = await newContact.save();
            employee.contact = savedContact._id;
        }
        if (data.paymentProfile) {
            if (data.paymentProfile._id) {
                await PaymentProfile.findByIdAndUpdate(data.paymentProfile._id, data.paymentProfile, {new: true});
            } else {
                const newPaymentProfile = new PaymentProfile(data.paymentProfile);
                const savedPaymentProfile = await newPaymentProfile.save();
                employee.paymentProfile = savedPaymentProfile._id;
            }
        }

        if (data.password) {
            employee.password = await helper.hashPassword(data.password);
        }

        return await employee.save();
    } catch (error) {
        throw new Error(`Error updating employee record: ${error.message}`);
    }
};


//get all Employee along with reference
export const getAllEmployee = async (data) => {
    try {
        const search = data.search || '';
        const page = parseInt(data.page, 10) || 1;
        const limit = parseInt(data.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const statusConditions = [
            {status: {$regex: '^ACTIVE$', $options: 'i'}},
            {status: {$regex: '^SUSPENDED$', $options: 'i'}},
            {status: {$regex: '^TERMINATED$', $options: 'i'}},
            {status: {$regex: '^DELETED$', $options: 'i'}}
        ];

        const searchConditions = search
            ? [
                {empId: {$regex: search, $options: 'i'}},
                {firstName: {$regex: search, $options: 'i'}},
                {lastName: {$regex: search, $options: 'i'}},
                {email: {$regex: search, $options: 'i'}},
                {role: {$regex: search, $options: 'i'}},
                {'contact.phoneNumberOne': {$regex: search, $options: 'i'}},
                {'branch.branchName': {$regex: search, $options: 'i'}}
            ]
            : [];

        const query = {
            $and: [
                {$or: statusConditions},
                ...(searchConditions.length > 0 ? [{$or: searchConditions}] : [])
            ]
        };
        const totalSize = await Employee.countDocuments(query);

        const list = await Employee.find(query)
            .skip(startIndex)
            .limit(limit)
            .populate('contact')
            .populate('branch')
            .populate('paymentProfile');

        const totalPages = Math.ceil((totalSize || 0) / limit);
        return {totalPages, content: list};
    } catch (error) {
        throw new Error(`Error fetching all records: ${error.message}`);
    }
};

// get by id
export const getEmployeesById = async (id) => {
    try {
        return await Employee.findOne({empId: id}).populate('contact').populate('currentContract').populate('branch').populate('paymentProfile');
    } catch (error) {
        throw new Error(`Error fetching branches: ${error.message}`);
    }
};

// Search for all employees
export const searchAllEmployees = async (data) => {
    try {
        const search = data.search || '';
        const branchId = data.branchId;
        const page = parseInt(data.page, 10) || 1;
        const limit = parseInt(data.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const statusConditions = [
            {status: {$regex: '^ACTIVE$', $options: 'i'}},
            {status: {$regex: '^SUSPENDED$', $options: 'i'}},
            {status: {$regex: '^TERMINATED$', $options: 'i'}},
        ];

        const searchConditions = search
            ? [
                {empId: {$regex: search, $options: 'i'}},
                {firstName: {$regex: search, $options: 'i'}},
                {lastName: {$regex: search, $options: 'i'}},
                {email: {$regex: search, $options: 'i'}},
                {'contact.phoneNumberOne': {$regex: search, $options: 'i'}}
            ]
            : [];

        const query = {
            $and: [
                {branch: branchId},
                {$or: statusConditions},
                ...(searchConditions.length > 0 ? [{$or: searchConditions}] : [])
            ]
        };
        const totalSize = await Employee.countDocuments(query);

        const list = await Employee.find(query)
            .skip(startIndex)
            .limit(limit)
            .populate('contact')
            .populate('paymentProfile');

        const totalPages = Math.ceil((totalSize || 0) / limit);
        return {totalPages, content: list};
    } catch (error) {
        throw new Error(`Error fetching all records: ${error.message}`);
    }
};


//generate unique employee id
async function generateEmployeeId() {
    try {
        const year = new Date().getFullYear();
        const result = await Counter.findOneAndUpdate(
            {id: 'employeeId'},
            {$inc: {seq: 1}},
            {new: true, upsert: true}
        );

        return `EMP${year}${String(result.seq).padStart(3, '0')}`;
    } catch (error) {
        throw error;
    }
}

// for payroll processing get the all employees that branch has and sort them with available contract
export const searchAllEmployeesWithContract = async (data) => {
    try {
        const search = data.search || '';
        const branchId = data.branchId;
        const page = parseInt(data.page, 10) || 1;
        const limit = parseInt(data.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const statusConditions = [
            {status: {$regex: '^ACTIVE$', $options: 'i'}},
        ];

        const searchConditions = search
            ? [
                {empId: {$regex: search, $options: 'i'}},
                {firstName: {$regex: search, $options: 'i'}},
                {lastName: {$regex: search, $options: 'i'}},
                {email: {$regex: search, $options: 'i'}},
                {'contact.phoneNumberOne': {$regex: search, $options: 'i'}}
            ]
            : [];

        const query = {
            $and: [
                {branch: branchId},
                {$or: statusConditions},
                {currentContract: {$ne: null}},
                ...(searchConditions.length > 0 ? [{$or: searchConditions}] : [])
            ]
        };

        const totalSize = await Employee.countDocuments(query);

        const list = await Employee.find(query)
            .skip(startIndex)
            .limit(limit)
            .populate('contact')
            .populate('currentContract');

        const totalPages = Math.ceil((totalSize || 0) / limit);
        return {totalPages, content: list};
    } catch (error) {
        throw new Error(`Error fetching all records: ${error.message}`);
    }
};

// employee total by branch
export const getBranchEmployeeRate = async (branchId) => {
    try {
        const now = new Date();

        // Get the start of the current and previous month
        const startOfCurrentMonth = startOfMonth(now);
        const startOfNextMonth = startOfMonth(addMonths(now, 1));
        const startOfLastMonth = startOfMonth(subMonths(now, 1));

        // Count employees for current and last month
        const currentMonthEmployees = await Employee.countDocuments({
            branch: new mongoose.Types.ObjectId(branchId),
            status: "Active",
            createdAt: {
                $gte: startOfCurrentMonth,
                $lt: startOfNextMonth
            }
        });

        const lastMonthEmployees = await Employee.countDocuments({
            branch: new mongoose.Types.ObjectId(branchId),
            status: "Active",
            createdAt: {
                $gte: startOfLastMonth,
                $lt: startOfCurrentMonth
            }
        });

        // Calculate percentage change
        const percentageChange = lastMonthEmployees > 0
            ? ((currentMonthEmployees - lastMonthEmployees) / lastMonthEmployees) * 100
            : currentMonthEmployees > 0 ? 100 : 0;

        const totalEmployees = await Employee.countDocuments({
            branch: new mongoose.Types.ObjectId(branchId),
            status: "Active",
        });

        return {
            branchId,
            totalEmployees,
            comparisonRate: percentageChange.toFixed(2)
        };
    } catch (error) {
        throw new Error("Unable to fetch employee rate");
    }
};

export const getRecentEmployees = async (branchId) => {
    try {
        const now = new Date();
        const startOfCurrentMonth = startOfMonth(now);
        const startOfNextMonth = startOfMonth(addMonths(now, 1));

        const currentMonthEmployees = await Employee.find({
            branch: new mongoose.Types.ObjectId(branchId),
            status: "Active",
            createdAt: {
                $gte: startOfCurrentMonth,
                $lt: startOfNextMonth
            }
        }).populate('currentContract')
            .sort({createdAt: -1});

        return currentMonthEmployees.slice(0,10);
    } catch (error) {
        throw new Error("Unable to fetch employee rate");
    }
}

export const getTotalEmployeesCount = async ()=>{
    return await Employee.countDocuments();
}

export const getAllRecentEmployees = async () => {

    try {
        const now = new Date();
        const startOfCurrentMonth = startOfMonth(now);
        const startOfNextMonth = startOfMonth(addMonths(now, 1));

        const currentMonthEmployees = await Employee.find({
            createdAt: {
                $gte: startOfCurrentMonth,
                $lt: startOfNextMonth
            }
        }).populate('currentContract')
            .sort({createdAt: -1});

        return currentMonthEmployees.slice(0,10);
    } catch (error) {
        throw new Error("Unable to fetch employee rate");
    }
}
