import express from "express";
import {
    getAllPayrollByEmpId,
    getBulkPayroll,
    getEmailReceipt,
    getSummery,
    postBulkPayroll,
    postPayRun,
    postSinglePayroll
} from "./payroll.controller.js";

//creating a router
const router = express.Router();

//api to get all the data
router.get('/bulkPayroll', getBulkPayroll);
router.get('/summery', getSummery);
router.get('/emailReceipt/:id', getEmailReceipt);
router.get('/:id', getAllPayrollByEmpId);

//api to save
router.post('/payrun', postPayRun);
router.post('/:id', postSinglePayroll);
router.post('/', postBulkPayroll);

//api to update
router.put('/:id');
//
//api to delete
router.delete('/:id');

export default router;