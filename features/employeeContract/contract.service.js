import {Contracts} from "./contract.schema.js";
import {Employee} from "../employee/employee.schema.js";

export const terminateContract = async (id) => {
    try {
        const item = await Contracts.findByIdAndUpdate(id, { status: 'Terminated', endDate: new Date()}, { new: true });
        if (!item) throw new Error('Contract not found');

        const employeeUpdate = await Employee.findByIdAndUpdate(
            item.employeeId,
            { currentContract: null },
            { new: true }
        );

        if (!employeeUpdate) {
            throw new Error('Failed to update employee current contract');
        }
        return item;
    } catch (error) {
        throw new Error(`Error updating record: ${error.message}`);
    }
};

//get contracts by employee id
export const getContractsById = async (id) => {
    try {
        return await Contracts.find({employeeId: id});
    } catch (error) {
        throw new Error(`Error fetching contracts: ${error.message}`);
    }
};

// create contract
export const createContract = async (data) => {
    try {
        const contractData = new Contracts(data);
        const savedContract = await contractData.save();

        await Employee.findByIdAndUpdate(data.employeeId,{currentContract:savedContract._id},{new: true});
        return contractData;
    } catch (error) {
        throw new Error(`Error Creating Employee: ${error.message}`);
    }
};