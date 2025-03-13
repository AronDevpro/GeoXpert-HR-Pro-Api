import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import {v4 as uuidv4} from 'uuid'
import {RefreshToken} from "../features/auth/refreshToken.schema.js";

const saltRounds = 10;

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
}

async function comparePassword(password, hashPassword) {
    return await bcrypt.compare(password, hashPassword);
}

export function generateAccessToken(user){
    const payload = {
        id: user._id,
        name: user.firstName + " " + user.lastName,
        email: user.email,
        branch:user.branch,
        status: user.status,
        role: user.role,
        contract:user.currentContract
    }
    return jwt.sign(payload,config.secretKey,{ expiresIn: '24H'})
}

export async function generateRefreshToken(userId) {
    let expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 7);
    const token = uuidv4()
    const refreshToken = await RefreshToken.create({
        token,
        user: userId,
        expiryDate: expiryDate.getTime()
    })
    return refreshToken.token
}

export function verifyRefreshTokenExpiration(token) {
    return token.expiryDate.getTime() < new Date().getTime();
}

export default { hashPassword, comparePassword, generateAccessToken,generateRefreshToken,verifyRefreshTokenExpiration };