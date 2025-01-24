import express from 'express';
import {getAllAttendanceByEmpId, postAttendance, putAttendance} from "./attendance.controller.js";

const router = express.Router();

router.get('/:id', getAllAttendanceByEmpId);

// mark attendance
router.post('/:id', postAttendance);

// update attendance
router.put('/:id', putAttendance);

export default router;