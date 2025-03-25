import {
    AttendanceRate,
    createAttendanceRecord, getBranchAttendanceRate,
    getEmpAttendanceByBranchId,
    getEmpAttendanceById, getTodayAttendance,
    updateAttendanceRecord
} from "./attendance.service.js";

export const getAllAttendanceByEmpId = async (req, res) => {
    try {
        const id = req.params.id
        const attendanceRecords = await getEmpAttendanceById(id,req.query);
        res.status(201).json(attendanceRecords);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message });
    }
};

export const getAllAttendanceByBranchId = async (req, res) => {
    try {
        const id = req.params.id;
        const attendanceRecords = await getEmpAttendanceByBranchId(id,req.query);
        res.status(201).json(attendanceRecords);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message });
    }
};

export const getAttendanceRate = async (req, res) => {
    try {
        const id = req.params.id;
        const attendanceRecords = await AttendanceRate(id);
        res.status(201).json(attendanceRecords);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message });
    }
};

export const getAttendanceRateByBranch = async (req, res) => {
    try {
        const id = req.params.id;
        const attendanceRecords = await getBranchAttendanceRate(id);
        res.status(201).json(attendanceRecords);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message });
    }
};

export const getTodayCurrentAttendance = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id)
        const attendanceRecords = await getTodayAttendance(id);
        res.status(201).json(attendanceRecords);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message });
    }
};

export const postAttendance = async (req, res) => {
    try {
        const id = req.params.id;
        const attendance = await createAttendanceRecord(id,req.body);
        res.status(201).json({data: attendance, message: "Attendance Marked."});
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message });
    }
};

export const putAttendance = async (req, res) => {
    try {
        const id = req.params.id
        const attendance = await updateAttendanceRecord(id, req.body);
        res.status(200).json({data: attendance, message: "Attendance Marked."});
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message });
    }
};