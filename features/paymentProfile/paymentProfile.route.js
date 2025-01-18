import express from "express";
import {
    deletePaymentProfile,
    getPaymentProfileById,
    postPaymentProfile,
    putPaymentProfile
} from "./paymentProfile.controller.js";

//creating a router
const router = express.Router();

//api to get all the data
router.get('/:id', getPaymentProfileById);

//api to save
router.post('/', postPaymentProfile)

//api to update
router.put('/:id', putPaymentProfile)
//
//api to delete
router.delete('/:id', deletePaymentProfile)

export default router;