import {create, getById, remove, update} from "../../service/commonCrud.js";
import {PaymentProfile} from "./paymentProfile.schema.js";

const model = PaymentProfile

export const getPaymentProfileById = async (req, res) => {
    try {
        const PaymentProfile = await getById(model,req.query);
        res.status(200).json(PaymentProfile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const postPaymentProfile = async (req, res) => {
    try {
        const PaymentProfile = await create(model,req.body);
        res.status(201).json({data:PaymentProfile, message: "Data Updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const putPaymentProfile = async (req, res) => {
    try {
        const id = req.params.id
        const PaymentProfile = await update(model,id,req.body);
        res.status(200).json({ data: PaymentProfile , message: "Data Updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePaymentProfile = async (req, res) => {
    try {
        await remove(model,req.params.id);
        res.status(200).json({ message: "Data Deleted." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};