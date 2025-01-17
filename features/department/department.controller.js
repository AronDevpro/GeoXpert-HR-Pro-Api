import {create, getAll, remove, update} from "../../service/commonCrud.js";
import {Department} from "./department.schema.js";

const model = Department

export const getAllDepartment = async (req, res) => {
    try {
        const Department = await getAll(model);
        res.status(200).json(Department);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const postDepartment = async (req, res) => {
    try {
        const Department = await create(model,req.body);
        res.status(201).json({data:Department, message: "Data Updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const putDepartment = async (req, res) => {
    try {
        const id = req.params.id
        const Department = await update(model,id,req.body);
        res.status(200).json({ data: Department , message: "Data Updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteDepartment = async (req, res) => {
    try {
        await remove(model,req.params.id);
        res.status(200).json({ message: "Data Deleted." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};