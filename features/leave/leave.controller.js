import {create, remove, update} from "../../service/commonCrud.js";
import {Leave} from "./leave.schema.js";
import {GetAllLeavesById, getBranchLeaveRate, getMonthlyLeaveRate, GetPendingReqByBranchId} from "./leave.service.js";

const model = Leave

export const getAllPendingLeavesByBranchId = async (req, res) => {
    try {
        const id = req.params.id;
        const Leave = await GetPendingReqByBranchId(id, req.query);
        res.status(200).json(Leave);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getAllLeaveByEmpId = async (req, res) => {
    try {
        const id = req.params.id;
        const Leave = await GetAllLeavesById(id, req.query);
        res.status(200).json(Leave);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getLeaveRateByEmpId = async (req, res) => {
    try {
        const id = req.params.id;
        const Leave = await getMonthlyLeaveRate(id, req.query);
        res.status(200).json(Leave);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getLeaveRateByBranchId = async (req, res) => {
    try {
        const id = req.params.id;
        const Leave = await getBranchLeaveRate(id, req.query);
        res.status(200).json(Leave);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const postLeave = async (req, res) => {
    try {
        const Leave = await create(model, req.body);
        res.status(201).json({data: Leave, message: "Data Updated."});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const putLeave = async (req, res) => {
    try {
        const id = req.params.id
        console.log(id)
        const LeaveType = await update(model, id, req.body);
        res.status(200).json({data: LeaveType, message: "Data Updated."});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const deleteLeave = async (req, res) => {
    try {
        await remove(model, req.params.id);
        res.status(200).json({message: "Data Deleted."});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};