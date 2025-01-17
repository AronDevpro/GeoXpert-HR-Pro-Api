import express from "express";
import {deleteLeave, getAllLeave, postLeave, putLeave} from "./leave.controller.js";

//creating a router
const router = express.Router();

//api to get all the data
router.get('/', getAllLeave);

//api to save
router.post('/', postLeave)

//api to update
router.put('/:id', putLeave)
//
//api to delete
router.delete('/:id', deleteLeave)

export default router;