import express from "express";
import {deleteContracts, getAllContracts, postContracts, putContracts} from "./contract.controller.js";

//creating a router
const router = express.Router();

//api to get all the data
router.get('/', getAllContracts);

//api to save
router.post('/', postContracts)

//api to update
router.put('/:id', putContracts)
//
//api to delete
router.delete('/:id', deleteContracts)

export default router;