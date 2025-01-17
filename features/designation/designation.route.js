import express from "express";
import {deleteDesignation, getAllDesignation, postDesignation, putDesignation} from "./designation.controller.js";

//creating a router
const router = express.Router();

//api to get all the data
router.get('/', getAllDesignation);

//api to save
router.post('/', postDesignation)

//api to update
router.put('/:id', putDesignation)
//
//api to delete
router.delete('/:id', deleteDesignation)

export default router;