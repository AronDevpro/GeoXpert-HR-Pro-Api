import {create, getAll, remove, update} from "../service/commonCrud.js";
import {OfficeShift} from "../models/officeShift.js";

const model = OfficeShift

export const getAllOfficeShift = async (req, res) => {
    try {
        const OfficeShift = await getAll(model);
        res.status(200).json(OfficeShift);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const postOfficeShift = async (req, res) => {
    try {
        const OfficeShift = await create(model,req.body);
        res.status(201).json({data:OfficeShift, message: "Data Updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const putOfficeShift = async (req, res) => {
    try {
        const id = req.params.id
        const OfficeShift = await update(model,id,req.body);
        res.status(200).json({ data: OfficeShift , message: "Data Updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteOfficeShift = async (req, res) => {
    try {
        await remove(model,req.params.id);
        res.status(200).json({ message: "Data Deleted." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};