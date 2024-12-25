import {Branch} from "../models/branch.js";
import {Contact} from "../models/contact.js";

// Create a new document
export const createBranch = async (data) => {
    try {
        const contactData = new Contact(data.contact);
        const savedContact = await contactData.save();

        const branchData = new Branch({
            ...data,
            contact: savedContact._id
        })
        return await branchData.save();
    } catch (error) {
        throw new Error(`Error creating record: ${error.message}`);
    }
};

//get all branches along with reference
export const getAllBranches = async () => {
    try {
        return await Branch.find().populate('contact');
    } catch (error) {
        throw new Error(`Error fetching branches: ${error.message}`);
    }
};