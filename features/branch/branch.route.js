import express from "express";
import {deleteBranch, getAllBranch, postBranch, putBranch} from "./branch.controller.js";

//creating a router
const router = express.Router();

//api to get all the data
router.get('/', getAllBranch);

//api to save
router.post('/', postBranch)

//api to update
router.put('/:id', putBranch)
//
//api to delete
router.delete('/:id', deleteBranch)

export default router;