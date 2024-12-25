import {create, getAll, remove, update} from "../service/commonCrud.js";
import {Employee} from "../models/employee.js";
import {createEmployee, getAllEmployees} from "../service/employeeService.js";

const model = Employee

export const getAllEmployee = async (req, res) => {
    try {
        const Employee = await getAllEmployees(model);
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
        const Employee = await update(model,id,req.body);
        res.status(200).json({ data: Employee , message: "Data Updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteEmployee = async (req, res) => {
    try {
        await remove(model,req.params.id);
        res.status(200).json({ message: "Data Deleted." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};