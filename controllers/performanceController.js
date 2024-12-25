import {create, getAll, remove, update} from "../service/commonCrud.js";
import {Performance} from "../models/Performance.js";

const model = Performance

export const getAllPerformance = async (req, res) => {
    try {
        const Performance = await getAll(model);
        res.status(200).json(Performance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const postPerformance = async (req, res) => {
    try {
        const Performance = await create(model,req.body);
        res.status(201).json({data:Performance, message: "Data Updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const putPerformance = async (req, res) => {
    try {
        const id = req.params.id
        const Performance = await update(model,id,req.body);
        res.status(200).json({ data: Performance , message: "Data Updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePerformance = async (req, res) => {
    try {
        await remove(model,req.params.id);
        res.status(200).json({ message: "Data Deleted." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};