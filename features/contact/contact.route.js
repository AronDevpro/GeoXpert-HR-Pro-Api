import express from "express";
import {deleteContact, getAllContact, postContact, putContact} from "./contact.controller.js";

//creating a router
const router = express.Router();

//api to get all the data
router.get('/', getAllContact);

//api to save
router.post('/', postContact)

//api to update
router.put('/:id', putContact)
//
//api to delete
router.delete('/:id', deleteContact)

export default router;