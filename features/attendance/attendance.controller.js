import {create, update} from "../../service/commonCrud.js";
import {Attendance} from "./attendance.schema.js";
import {createAttendanceRecord, getEmpAttendanceById, updateAttendanceRecord} from "./attendance.service.js";

const model = Attendance

export const getAllAttendanceByEmpId = async (req, res) => {
    try {
        const id = req.params.id
        const attendanceRecords = await getEmpAttendanceById(id);
        res.status(200).json(attendanceRecords);
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