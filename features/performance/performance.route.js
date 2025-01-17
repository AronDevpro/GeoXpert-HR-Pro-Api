import express from "express";
import {deletePerformance, getAllPerformance, postPerformance, putPerformance} from "./performance.controller.js";

//creating a router
const router = express.Router();

//api to get all the data
router.get('/', getAllPerformance);

//api to save
router.post('/', postPerformance)

//api to update
router.put('/:id', putPerformance)
//
//api to delete
router.delete('/:id', deletePerformance)

export default router;