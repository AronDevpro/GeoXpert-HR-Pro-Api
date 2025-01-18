import {remove, statusChange} from "../../service/commonCrud.js";
import {Branch} from "./branch.schema.js";
import {activeBranches, createBranch, searchAllBranches, updateBranch} from "./branch.service.js";

const model = Branch

export const getAllBranch = async (req, res) => {
    try {
        const Branch = await searchAllBranches(req.query)
        res.status(200).json(Branch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllActiveBranch = async (req, res) => {
    try {
        const Branch = await activeBranches(req.query)
        res.status(200).json(Branch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const postBranch = async (req, res) => {
    try {
        const Branch = await createBranch(req.body);
        res.status(201).json({data:Branch, message: "Data Updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const putBranch = async (req, res) => {
    try {
        const id = req.params.id
        const Branch = await updateBranch(id,req.body);
        res.status(200).json({ data: Branch , message: "Data Updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const changeBranchStatus = async (req, res) => {
    try {
        const id = req.params.id
        const Branch = await statusChange(model,id, req.body);
        res.status(200).json({ data: Branch , message: "Data Updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteBranch = async (req, res) => {
    try {
        await remove(model,req.params.id);
        res.status(200).json({ message: "Data Deleted." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};