import express from "express";
import {loginEmployee, refreshToken} from "../controllers/authController.js";

//creating a router
const router = express.Router();

//api to login
router.post('/', loginEmployee)

//api to get re new refresh Token
router.post('/refresh', refreshToken)

export default router;