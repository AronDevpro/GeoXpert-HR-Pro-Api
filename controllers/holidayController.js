import {create, getAll, remove, update} from "../service/commonCrud.js";
import {Holiday} from "../models/holiday.js";

const model = Holiday

export const getAllHoliday = async (req, res) => {
    try {
        const Holiday = await getAll(model);
        res.status(200).json(Holiday);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const postHoliday = async (req, res) => {
    try {
        const Holiday = await create(model,req.body);
        res.status(201).json({data:Holiday, message: "Data Updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const putHoliday = async (req, res) => {
    try {
        const id = req.params.id
        const Holiday = await update(model,id,req.body);
        res.status(200).json({ data: Holiday , message: "Data Updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteHoliday = async (req, res) => {
    try {
        await remove(model,req.params.id);
        res.status(200).json({ message: "Data Deleted." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};