import {Contact} from "../contact/contact.schema.js";
import {Employee} from "./employee.schema.js";
import helper from "../../util/helper.js";
import {sendUserRegisterEmail} from "../../util/mailTemplate.js";
import {PaymentProfile} from "../paymentProfile/paymentProfile.schema.js";
import {Counter} from "./counter.schema.js";

// Create a new document
export const createEmployee = async (data) => {
    try {
        const existingEmployee = await Employee.findOne({ email: data.email });
        if (existingEmployee) {
            throw new Error('Email already exists');
        }

        // save contact
        const contactData = new Contact(data.contact);
        const savedContact = await contactData.save();

        // save Payment profile
        const paymentProfile = new PaymentProfile(data.bank);
        const SavedPaymentProfile =await paymentProfile.save();

        const hashPassword = await helper.hashPassword(data.password);
        const employeeId = await generateEmployeeId();

        const empData = new Employee({
            ...data,
            empId:employeeId,
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
        const employee = await Employee.findByIdAndUpdate(id, data, { new: true });
        if (!employee) throw new Error('Employee not found');

        if (data.contact && data.contact._id) {
            await Contact.findByIdAndUpdate(data.contact._id, data.contact, { new: true });
        } else if (data.contact) {
            const newContact = new Contact(data.contact);
            const savedContact = await newContact.save();
            employee.contact = savedContact._id;
        }

        if (data.bank) {
            if (data.bank._id) {
                await PaymentProfile.findByIdAndUpdate(data.bank._id, data.bank, { new: true });
            } else {
                const newPaymentProfile = new PaymentProfile(data.bank);
                const savedPaymentProfile = await newPaymentProfile.save();
                employee.paymentProfile = savedPaymentProfile._id;
            }
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
            { status: { $regex: '^ACTIVE$', $options: 'i' } },
            { status: { $regex: '^SUSPENDED$', $options: 'i' } },
            { status: { $regex: '^TERMINATED$', $options: 'i' } },
            { status: { $regex: '^DELETED$', $options: 'i' } }
        ];

        const searchConditions = search
            ? [
                { empId: { $regex: search, $options: 'i' } },
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { role: { $regex: search, $options: 'i' } },
                { 'contact.phoneNumberOne': { $regex: search, $options: 'i' } },
                { 'branch.branchName': { $regex: search, $options: 'i' } }
            ]
            : [];

        const query = {
            $and: [
                { $or: statusConditions },
                ...(searchConditions.length > 0 ? [{ $or: searchConditions }] : [])
            ]
        };
        const totalSize = await Employee.countDocuments(query);

        const list =  await Employee.find(query)
            .skip(startIndex)
            .limit(limit)
            .populate('contact').populate('branch');
        const totalPages = Math.ceil((totalSize || 0) / limit);
        return { totalPages, content: list };
    } catch (error) {
        throw new Error(`Error fetching all records: ${error.message}`);
    }
};

// get by id
export const getEmployeesById = async (id) => {
    try {
        return await Employee.findOne({empId:id}).populate('contact').populate('currentContract').populate('branch').populate('paymentProfile');
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
            { status: { $regex: '^ACTIVE$', $options: 'i' } },
            { status: { $regex: '^INACTIVE$', $options: 'i' } },
            { status: { $regex: '^PENDING$', $options: 'i' } },
            { status: { $regex: '^REJECTED$', $options: 'i' } },
            { status: { $regex: '^approved$', $options: 'i' } }
        ];

        const searchConditions = search
            ? [
                { empId: { $regex: search, $options: 'i' } },
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { 'contact.phoneNumberOne': { $regex: search, $options: 'i' } }
            ]
            : [];

        const query = {
            $and: [
                { branch: branchId },
                { $or: statusConditions },
                ...(searchConditions.length > 0 ? [{ $or: searchConditions }] : [])
            ]
        };
        const totalSize = await Employee.countDocuments(query);

        const list =  await Employee.find(query)
            .skip(startIndex)
            .limit(limit)
            .populate('contact');
        const totalPages = Math.ceil((totalSize || 0) / limit);
        return { totalPages, content: list };
    } catch (error) {
        throw new Error(`Error fetching all records: ${error.message}`);
    }
};


//generate unique employee id
async function generateEmployeeId() {
    try {
        const year = new Date().getFullYear();
        const result = await Counter.findOneAndUpdate(
            { id: 'employeeId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        return `EMP${year}${String(result.seq).padStart(3, '0')}`;
    } catch (error) {
        throw error;
    }
}