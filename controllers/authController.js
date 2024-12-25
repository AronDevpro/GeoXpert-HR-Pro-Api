import {login, newRefreshToken} from "../service/authService.js";

export const loginEmployee = async (req, res) => {
    try {
        const User = await login(req.body);
        res.status(201).json(User);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const User = await newRefreshToken(req.body);
        res.status(201).json(User);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
