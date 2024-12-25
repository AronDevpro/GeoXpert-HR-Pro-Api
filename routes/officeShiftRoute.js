import express from "express";
import {deleteOfficeShift, getAllOfficeShift, postOfficeShift, putOfficeShift} from "../controllers/officeShiftsController.js";

//creating a router
const router = express.Router();

//api to get all the data
router.get('/', getAllOfficeShift);

//api to save
router.post('/', postOfficeShift)

//api to update
router.put('/:id', putOfficeShift)
//
//api to delete
router.delete('/:id', deleteOfficeShift)

export default router;