import express from "express";
import {
    deleteLeave,
    getAllLeaveByEmpId,
    getAllPendingLeavesByBranchId,
    postLeave,
    putLeave
} from "./leave.controller.js";

//creating a router
const router = express.Router();

//api to get all the data
router.get('/', getAllLeaveByEmpId);

// api to get all leaves by emp id
router.get('/:id', getAllLeaveByEmpId);

// api to get all pending leaves req by branch id
router.get('/search/:id', getAllPendingLeavesByBranchId);

//api to save
router.post('/', postLeave)

//api to update
router.put('/:id', putLeave)
//
//api to delete
router.delete('/:id', deleteLeave)

export default router;