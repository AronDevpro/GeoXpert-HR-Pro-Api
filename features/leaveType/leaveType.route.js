import express from "express";
import {deleteLeaveType, getAllLeaveType, postLeaveType, putLeaveType} from "./leaveType.controller.js";

//creating a router
const router = express.Router();

//api to get all the data
router.get('/', getAllLeaveType);

//api to save
router.post('/', postLeaveType)

//api to update
router.put('/:id', putLeaveType)
//
//api to delete
router.delete('/:id', deleteLeaveType)

export default router;