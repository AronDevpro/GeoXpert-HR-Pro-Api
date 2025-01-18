import express from "express";
import {
    deleteContracts,
    getAllContractsByEmpId,
    postContracts,
    putContracts,
    terminateContact
} from "./contract.controller.js";

//creating a router
const router = express.Router();

//api to get all the data by emp id
router.get('/:id', getAllContractsByEmpId);

//api to save
router.post('/', postContracts);

//api to update
router.put('/:id', putContracts);

// terminate contract
router.put('/terminate/:id', terminateContact);

//api to delete
router.delete('/:id', deleteContracts)

export default router;