import {Leave} from "./leave.schema.js";

export const GetAllSearchLeave = async (data) => {
    try {
        const search = data.search || '';
        const page = parseInt(data.page, 10) || 1;
        const limit = parseInt(data.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const query = {
            $or: [
                { status: { $regex: '^ACTIVE$', $options: 'i' } },
                { status: { $regex: '^INACTIVE$', $options: 'i' } },
                { status: { $regex: '^PENDING$', $options: 'i' } },
                { status: { $regex: '^REJECTED$', $options: 'i' } },
                { status: { $regex: '^approved$', $options: 'i' } }
            ],
        };

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const totalSize = await Leave.countDocuments(query);

        const list =  await Leave.find(query)
            .skip(startIndex)
            .limit(limit).populate('employee');
        const totalPages = Math.ceil((totalSize || 0) / limit);
        return { totalPages, content: list };
    } catch (error) {
        throw new Error(`Error fetching all records: ${error.message}`);
    }
};