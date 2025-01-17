import {create, remove, search, update} from "../../service/commonCrud.js";
import {Leave} from "./leave.schema.js";

const model = Leave

export const getAllLeave = async (req, res) => {
    try {
        const LeaveType = await search(model,req.query);
        res.status(200).json(LeaveType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const postLeave = async (req, res) => {
    try {
        const LeaveType = await create(model,req.body);
        res.status(201).json({data:LeaveType, message: "Data Updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const putLeave = async (req, res) => {
    try {
        const id = req.params.id
        console.log(id)
        const LeaveType = await update(model,id,req.body);
        res.status(200).json({ data: LeaveType , message: "Data Updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteLeave = async (req, res) => {
    try {
        await remove(model,req.params.id);
        res.status(200).json({ message: "Data Deleted." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};