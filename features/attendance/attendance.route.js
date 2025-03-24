import express from 'express';
import {
    getAllAttendanceByBranchId,
    getAllAttendanceByEmpId, getAttendanceRate, getAttendanceRateByBranch, getTodayCurrentAttendance,
    postAttendance,
    putAttendance
} from "./attendance.controller.js";

const router = express.Router();

// get all attendance by branch id
router.get('/branch/:id', getAllAttendanceByBranchId);

// get today attendance
router.get('/today/:id', getTodayCurrentAttendance);

// get branch attendance
router.get('/branchRate/:id', getAttendanceRateByBranch);

// get attendance rate
router.get('/rate/:id', getAttendanceRate);

// get attendance by emp id
router.get('/:id', getAllAttendanceByEmpId);

// mark attendance
router.post('/:id', postAttendance);

// update attendance
router.put('/:id', putAttendance);

export default router;