import express from "express";
import {deleteHoliday, getAllHoliday, postHoliday, putHoliday} from "../controllers/holidayController.js";

//creating a router
const router = express.Router();

//api to get all the data
router.get('/', getAllHoliday);

//api to save
router.post('/', postHoliday)

//api to update
router.put('/:id', putHoliday)
//
//api to delete
router.delete('/:id', deleteHoliday)

export default router;