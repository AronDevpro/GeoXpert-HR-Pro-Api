import {Branch} from "./branch.schema.js";
import {Contact} from "../contact/contact.schema.js";

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

//search
export const searchAllBranches = async (data) => {
    try {
        const search = data.search || '';
        const page = parseInt(data.page, 10) || 1;
        const limit = parseInt(data.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const statusConditions = [
            {status: {$regex: '^ACTIVE$', $options: 'i'}},
            {status: {$regex: '^INACTIVE$', $options: 'i'}},
        ];

        const searchConditions = search
            ? [
                {branchName: {$regex: search, $options: 'i'}},
                {branchCode: {$regex: search, $options: 'i'}},
                {'contact.phoneNumberOne': {$regex: search, $options: 'i'}}
            ]
            : [];

        const query = {
            $and: [
                {$or: statusConditions},
                ...(searchConditions.length > 0 ? [{$or: searchConditions}] : [])
            ]
        };
        const totalSize = await Branch.countDocuments(query);

        const list = await Branch.find(query)
            .skip(startIndex)
            .limit(limit)
            .populate('contact');
        const totalPages = Math.ceil((totalSize || 0) / limit);
        return {totalPages, content: list};
    } catch (error) {
        throw new Error(`Error fetching all records: ${error.message}`);
    }
};

// update branch
export const updateBranch = async (id, data) => {
    try {
        const item = await Branch.findByIdAndUpdate(id, data, {new: true});
        if (!item) throw new Error('Branch not found');

        const contactData = new Contact(data.contact);
        const contact = await Contact.findByIdAndUpdate(contactData._id, contactData, {new: true});
        if (!contact) throw new Error('Contact not found');

        return item;
    } catch (error) {
        throw new Error(`Error updating record: ${error.message}`);
    }
};

// get only active branches
export const activeBranches = async (data) => {
    try {
        const search = data.search || '';
        const page = parseInt(data.page, 10) || 1;
        const limit = parseInt(data.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const searchConditions = search
            ? [
                {branchName: {$regex: search, $options: 'i'}},
                {branchCode: {$regex: search, $options: 'i'}},
            ]
            : [];

        const query = {
            status: {$regex: '^ACTIVE$', $options: 'i'},
            ...(searchConditions.length > 0 ? {$or: searchConditions} : {})
        };

        const totalSize = await Branch.countDocuments(query);

        const list = await Branch.find(query)
            .skip(startIndex)
            .limit(limit)

        // Transform the response to include only branchName and _id
        const modifiedList = list.map((branch) => ({
            _id: branch._id,
            name: branch.branchName,
        }));

        const totalPages = Math.ceil((totalSize || 0) / limit);
        return {totalPages, content: modifiedList};
    } catch (error) {
        throw new Error(`Error fetching all records: ${error.message}`);
    }
};

export const getTotalBranchCount = async ()=>{
    return await Branch.countDocuments();
}

