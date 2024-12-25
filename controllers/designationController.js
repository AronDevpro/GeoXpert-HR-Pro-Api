import {create, getAll, remove, update} from "../service/commonCrud.js";
import {Designation} from "../models/Designation.js";

const model = Designation

export const getAllDesignation = async (req, res) => {
    try {
        const Designation = await getAll(model);
        res.status(200).json(Designation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const postDesignation = async (req, res) => {
    try {
        const Designation = await create(model,req.body);
        res.status(201).json({data:Designation, message: "Data Updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const putDesignation = async (req, res) => {
    try {
        const id = req.params.id
        const Designation = await update(model,id,req.body);
        res.status(200).json({ data: Designation , message: "Data Updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteDesignation = async (req, res) => {
    try {
        await remove(model,req.params.id);
        res.status(200).json({ message: "Data Deleted." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};