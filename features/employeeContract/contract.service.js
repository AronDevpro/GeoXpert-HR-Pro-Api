import {Contracts} from "./contract.schema.js";

export const terminateContract = async (id) => {
    try {
        const item = await Contracts.findByIdAndUpdate(id, { status: 'TERMINATED' }, { new: true });
        if (!item) throw new Error('Contract not found');
        return item;
    } catch (error) {
        throw new Error(`Error updating record: ${error.message}`);
    }
};