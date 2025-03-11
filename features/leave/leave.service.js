import {Leave} from "./leave.schema.js";
import mongoose from "mongoose";

export const GetAllLeavesById = async (id, data) => {
    try {
        const page = parseInt(data.page, 10) || 1;
        const limit = parseInt(data.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const totalSize = await Leave.countDocuments({employee: id});

        const list = await Leave.find({employee: id})
            .skip(startIndex)
            .limit(limit)
            .populate('employee')
            .sort({createdAt: -1});
        const totalPages = Math.ceil((totalSize || 0) / limit);
        return {totalPages, content: list};
    } catch (error) {
        throw new Error(`Error fetching all records: ${error.message}`);
    }
};

export const GetPendingReqByBranchId = async (id, data) => {
    try {
        const branchId = new mongoose.Types.ObjectId(id);
        const search = data.search || '';
        const page = parseInt(data.page, 10) || 1;
        const limit = parseInt(data.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const statusConditions = [
            {status: {$regex: '^PENDING$', $options: 'i'}},
        ];

        const searchConditions = search
            ? [
                {empId: {$regex: search, $options: 'i'}},
                {firstName: {$regex: search, $options: 'i'}},
                {lastName: {$regex: search, $options: 'i'}},
            ]
            : [];

        const query = {
            $and: [
                {$or: statusConditions},
                ...(searchConditions.length > 0 ? [{$or: searchConditions}] : [])
            ]
        };

        const list = await Leave.find(query)
            .skip(startIndex)
            .limit(limit)
            .populate('employee')
            .sort({createdAt: -1});

        let filteredBranch = list.filter(emp => emp?.employee?.branch?.equals(branchId));

        // Filter by search (firstName or lastName)
        if (search) {
            filteredBranch = filteredBranch.filter(emp => {
                const firstName = emp?.employee?.firstName?.toLowerCase() || '';
                const lastName = emp?.employee?.lastName?.toLowerCase() || '';
                return firstName.includes(search) || lastName.includes(search);
            });
        }

        if (filteredBranch.length === 0) {
            throw {status: 400, message: "Couldn't find any leave req with the specified branch"};
        }
        const paginatedResults = filteredBranch.slice(startIndex, startIndex + limit);
        const totalPages = Math.ceil((filteredBranch.length || 0) / limit);
        return {totalPages, content: paginatedResults};
    } catch (error) {
        throw new Error(`Error fetching all records: ${error.message}`);
    }
};