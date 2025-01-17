import {create, getAll, remove, update} from "../../service/commonCrud.js";
import {Contracts} from "./contract.schema.js";

const model = Contracts

export const getAllContracts = async (req, res) => {
    try {
        const Contracts = await getAll(model);
        res.status(200).json(Contracts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const postContracts = async (req, res) => {
    try {
        const Contracts = await create(model,req.body);
        res.status(201).json({data:Contracts, message: "Data Updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const putContracts = async (req, res) => {
    try {
        const id = req.params.id
        const Contracts = await update(model,id,req.body);
        res.status(200).json({ data: Contracts , message: "Data Updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteContracts = async (req, res) => {
    try {
        await remove(model,req.params.id);
        res.status(200).json({ message: "Data Deleted." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};