// Fetch all documents
export const getAll = async (model) => {
    try {
        return await model.find();
    } catch (error) {
        throw new Error(`Error fetching all records: ${error.message}`);
    }
};

// fetch by search
export const search = async (model,data) => {
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

        const totalSize = await model.countDocuments(query);

        const list =  await model.find(query)
            .skip(startIndex)
            .limit(limit);
        const totalPages = Math.ceil((totalSize || 0) / limit);
        return { totalPages, content: list };
    } catch (error) {
        throw new Error(`Error fetching all records: ${error.message}`);
    }
};

// Create a new document
export const create = async (model, data) => {
    try {
        const item = new model(data);
        return await item.save();
    } catch (error) {
        throw new Error(`Error creating record: ${error.message}`);
    }
};

// Fetch a document by ID
export const getById = async (model, id) => {
    try {
        const item = await model.findById(id);
        if (!item) throw new Error('Item not found');
        return item;
    } catch (error) {
        throw new Error(`Error fetching record by ID: ${error.message}`);
    }
};

// Update a document by ID
export const update = async (model, id, data) => {
    try {
        const item = await model.findByIdAndUpdate(id, data, { new: true });
        if (!item) throw new Error('Item not found');
        return item;
    } catch (error) {
        throw new Error(`Error updating record: ${error.message}`);
    }
};

// Delete a document by ID
export const remove = async (model, id) => {
    try {
        const item = await model.findByIdAndDelete(id);
        if (!item) throw new Error('Item not found');
        return item;
    } catch (error) {
        throw new Error(`Error deleting record: ${error.message}`);
    }
};

// soft delete
export const softDelete = async (model,id) => {
    try {
        const item = await model.findByIdAndUpdate(id, { status: 'DELETED' }, { new: true });
        if (!item) throw new Error('Item not found');
        return item;
    } catch (error) {
        throw new Error(`Error updating record: ${error.message}`);
    }
};
