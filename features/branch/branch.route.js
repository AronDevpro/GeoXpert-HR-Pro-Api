import express from "express";
import {
    changeBranchStatus,
    deleteBranch, getAllActiveBranch,
    getAllBranch,
    postBranch,
    putBranch,
} from "./branch.controller.js";

//creating a router
const router = express.Router();

//api to get all the data
router.get('/', getAllBranch);

//api to get all the data
router.get('/active', getAllActiveBranch);

//api to save
router.post('/', postBranch);

//api to update
router.put('/:id', putBranch);

//suspend branch
router.put('/status/:id', changeBranchStatus);

//api to delete
router.delete('/:id', deleteBranch)

export default router;