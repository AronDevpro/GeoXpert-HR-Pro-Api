import express from "express";
import {getPromotion, getTurnOver} from "./predict.controller.js";

//creating a router
const router = express.Router();

//api to get all the data
router.get('/turnover/:id', getTurnOver);

router.get('/promotion/:id', getPromotion);


export default router;