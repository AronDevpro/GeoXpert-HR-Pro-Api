import {create, getAll, remove, update} from "../service/commonCrud.js";
import {Contact} from "../models/contact.js";

const model = Contact

export const getAllContact = async (req, res) => {
    try {
        const Contact = await getAll(model);
        res.status(200).json(Contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const postContact = async (req, res) => {
    try {
        const Contact = await create(model,req.body);
        res.status(201).json({data:Contact, message: "Data Updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const putContact = async (req, res) => {
    try {
        const id = req.params.id
        const Contact = await update(model,id,req.body);
        res.status(200).json({ data: Contact , message: "Data Updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteContact = async (req, res) => {
    try {
        await remove(model,req.params.id);
        res.status(200).json({ message: "Data Deleted." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};