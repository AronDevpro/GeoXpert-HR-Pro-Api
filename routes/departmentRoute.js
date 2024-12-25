import express from "express";
import {deleteDepartment, getAllDepartment, postDepartment, putDepartment} from "../controllers/departmentController.js";

//creating a router
const router = express.Router();

//api to get all the data
router.get('/', getAllDepartment);

//api to save
router.post('/', postDepartment)

//api to update
router.put('/:id', putDepartment)
//
//api to delete
router.delete('/:id', deleteDepartment)

export default router;