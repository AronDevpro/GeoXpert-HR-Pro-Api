import express from "express";
import {getSetting, putSetting} from "./setting.controller.js";

//creating a router
const router = express.Router();

//api to get all the data
router.get('/', getSetting);

//api to update
router.put('/', putSetting)

export default router;