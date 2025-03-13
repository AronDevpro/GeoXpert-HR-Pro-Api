import express from "express";
import {
    changeEmployeeStatus,
    deleteEmployee,
    getAllEmployees,
    getEmployeeByEmpNo,
    getEmployeeById,
    getEmployeesCount,
    getEmployeeTotalRateByBranch,
    getRecentAllEmployees,
    getRecentEmployeesByBranch,
    postEmployee,
    putEmployee,
    searchAllEmployeesBasedOnBranch,
    searchAllEmployeesBasedOnBranchWithContract
} from "./employee.controller.js";

//creating a router
const router = express.Router();

//api to get all the data
router.get('/', getAllEmployees);

//api to get all the data
router.get('/search', searchAllEmployeesBasedOnBranch);

// employees count
router.get('/count', getEmployeesCount);

// api to get total rate by branch id
router.get('/rate/:id', getEmployeeTotalRateByBranch);

// get recent employees
router.get('/recent/:id', getRecentEmployeesByBranch);
router.get('/recent', getRecentAllEmployees);

// api to search on payroll
router.get('/payroll/search', searchAllEmployeesBasedOnBranchWithContract);

// gte by id
router.get('/empById/:id', getEmployeeById);
router.get('/:id', getEmployeeByEmpNo);

//api to save
router.post('/', postEmployee)

//api to update
router.put('/:id', putEmployee)

//api to change status
router.put('/status/:id', changeEmployeeStatus)

//api to delete
router.delete('/:id', deleteEmployee)

export default router;