import {create, remove, search, update} from "../../service/commonCrud.js";
import {LeaveType} from "./leaveType.schema.js";

const model = LeaveType

export const getAllLeaveType = async (req, res) => {
    try {
        const LeaveType = await search(model,req.query);
        res.status(200).json(LeaveType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const postLeaveType = async (req, res) => {
    try {
        const LeaveType = await create(model,req.body);
        res.status(201).json({data:LeaveType, message: "Data Updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const putLeaveType = async (req, res) => {
    try {
        const id = req.params.id
        const LeaveType = await update(model,id,req.body);
        res.status(200).json({ data: LeaveType , message: "Data Updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteLeaveType = async (req, res) => {
    try {
        await remove(model,req.params.id);
        res.status(200).json({ message: "Data Deleted." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};