import express from "express";
import {loginEmployee, refreshToken} from "./auth.controller.js";

//creating a router
const router = express.Router();

//api to login
router.post('/', loginEmployee)

//api to get re new refresh Token
router.post('/refresh', refreshToken)

export default router;