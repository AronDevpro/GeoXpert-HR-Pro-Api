import express from "express";
import {deleteEmployee, getAllEmployee, postEmployee, putEmployee} from "../controllers/employeeController.js";

//creating a router
const router = express.Router();

//api to get all the data
router.get('/', getAllEmployee);

//api to save
router.post('/', postEmployee)

//api to update
router.put('/:id', putEmployee)
//
//api to delete
router.delete('/:id', deleteEmployee)

export default router;