// Fetch all documents
export const getAll = async (model) => {
    try {
        return await model.find();
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
