import {
    createSinglePayroll,
    generateBulkPayroll,
    generatePayRun, getPayrollById,
    sendReceiptEmail,
    summeryPayroll
} from "./payroll.service.js";
import { search} from "../../service/commonCrud.js";
import {BulkPayroll} from "./bulkPayroll.schema.js";
import {getEmpAttendanceById} from "../attendance/attendance.service.js";

export const postSinglePayroll = async (req, res) => {
    try {
        const id = req.params.id;
        const payroll = await createSinglePayroll(id,req.body);
        res.status(201).json({data: payroll, message: "Payroll created successfully"});
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message });
    }
};

export const postBulkPayroll = async (req, res) => {
    try {
        const {period,dataArray} = req.body;
        const payroll = await generateBulkPayroll(dataArray,period);
        res.status(201).json({data: payroll, message: "Payroll generation completed"});
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message });
    }
};

export const postPayRun = async (req, res) => {
    try {
        const payroll = await generatePayRun(req.body);
        res.status(201).json({data: payroll, message: "Payroll generation completed"});
    } catch (error) {
        const status = error.status || 500;
        console.log(error)
        res.status(status).json({ message: error.message });
    }
};

export const getBulkPayroll = async (req, res) => {
    try {
        const payroll = await search(BulkPayroll,req.query,"desc");
        res.status(201).json(payroll);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getSummery = async (req, res) => {
    try {
        const payroll = await summeryPayroll(req.query);
        res.status(201).json(payroll);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getEmailReceipt = async (req, res) => {
    try {
        const id = req.params.id;
        const payroll = await sendReceiptEmail(id);
        res.status(201).json(payroll);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllPayrollByEmpId = async (req, res) => {
    try {
        const id = req.params.id
        const payroll = await getPayrollById(id,req.query);
        res.status(201).json(payroll);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message });
    }
};
