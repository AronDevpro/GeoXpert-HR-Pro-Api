import {Contact} from "../models/contact.js";
import {Employee} from "../models/employee.js";
import helper from "../util/helper.js";
import {sendUserRegisterEmail} from "../util/mailTemplate.js";

// Create a new document
export const createEmployee = async (data) => {
    try {
        const contactData = new Contact(data.contact);
        const savedContact = await contactData.save();

        const hashPassword = await helper.hashPassword(data.password);

        const empData = new Employee({
            ...data,
            contact: savedContact._id,
            password: hashPassword
        })
        const user = await empData.save();
        await sendUserRegisterEmail(user);
        return user;
    } catch (error) {
        throw new Error(`Error creating record: ${error.message}`);
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