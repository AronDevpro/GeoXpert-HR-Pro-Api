import express from "express";
import {
    changeEmployeeStatus,
    deleteEmployee,
    getAllEmployees,
    getEmployeeById,
    postEmployee,
    putEmployee,
    searchAllEmployeesBasedOnBranch
} from "./employee.controller.js";

//creating a router
const router = express.Router();

//api to get all the data
router.get('/', getAllEmployees);

//api to get all the data
router.get('/search', searchAllEmployeesBasedOnBranch);

// gte by id
router.get('/:id', getEmployeeById);

//api to save
router.post('/', postEmployee)

//api to update
router.put('/:id', putEmployee)

//api to change status
router.put('/status/:id', changeEmployeeStatus)

//api to delete
router.delete('/:id', deleteEmployee)

export default router;