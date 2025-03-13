import express from "express";
import {getPublicSetting, getSetting, putSetting} from "./setting.controller.js";
import passport from "../../config/passport.js";

//creating a router
const router = express.Router();

//api to get all the data
router.get('/',passport.authenticate('jwt', {session: false}), getSetting);

// public access
router.get('/public', getPublicSetting);

//api to update
router.put('/',passport.authenticate('jwt', {session: false}), putSetting)

export default router;