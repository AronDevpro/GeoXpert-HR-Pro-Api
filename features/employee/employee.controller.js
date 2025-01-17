import {softDelete} from "../../service/commonCrud.js";
import {Employee} from "./employee.schema.js";
import {createEmployee, searchAllEmployees, updateEmployee} from "./employee.service.js";

const model = Employee

export const getAllEmployee = async (req, res) => {
    try {
        const Employee = await searchAllEmployees(req.query);
        res.status(200).json(Employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const postEmployee = async (req, res) => {
    try {
        const Employee = await createEmployee(req.body);
        res.status(201).json({data:Employee, message: "Data Updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const putEmployee = async (req, res) => {
    try {
        const id = req.params.id
        const Employee = await updateEmployee(id,req.body);
        res.status(200).json({ data: Employee , message: "Data Updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteEmployee = async (req, res) => {
    try {
        await softDelete(model,req.params.id);
        res.status(200).json({ message: "Data Deleted." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};