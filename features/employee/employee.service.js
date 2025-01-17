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

        const contactData = new Contact(data.contact);
        const savedContact = await contactData.save();

        const hashPassword = await helper.hashPassword(data.password);
        const employeeId = await generateEmployeeId();

        const empData = new Employee({
            ...data,
            empId:employeeId,
            contact: savedContact._id,
            password: hashPassword
        })
        const user = await empData.save();

        const paymentProfile = new PaymentProfile({...data.bank, employeeId:user._id});
        await paymentProfile.save();

        await sendUserRegisterEmail(user);
        return user;
    } catch (error) {
        throw new Error(`Error Creating Employee: ${error.message}`);
    }
};

// Update a document by ID
export const updateEmployee = async (id, data) => {
    try {
        const item = await Employee.findByIdAndUpdate(id, data, { new: true });
        if (!item) throw new Error('Employee not found');
        const contactData = new Contact(data.contact);
        const contact = await Contact.findByIdAndUpdate(contactData._id, contactData, { new: true });
        if (!contact) throw new Error('Contact not found');
        return item;
    } catch (error) {
        throw new Error(`Error updating record: ${error.message}`);
    }
};

//get all Employee along with reference
export const getAllEmployees = async () => {
    try {
        return await Employee.find().populate('contact');
    } catch (error) {
        throw new Error(`Error fetching branches: ${error.message}`);
    }
};

// Search for all employees
export const searchAllEmployees = async (data) => {
    try {
        const search = data.search || '';
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