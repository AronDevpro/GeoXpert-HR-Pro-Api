import {Employee} from "../employee/employee.schema.js";
import helper from "../../util/helper.js";
import {RefreshToken} from "./refreshToken.schema.js";

export const login = async (data) => {
    const {email, password} = data;
    const user = await Employee.findOne({email}).populate('branch').populate({
        path: 'currentContract',
        populate: {path: 'officeShift', model: 'OfficeShift'},
    });

    if (!user) {
        throw new Error('Invalid email');
    }

    const isPasswordCorrect = await helper.comparePassword(
        password,
        user.password
    );

    if (!isPasswordCorrect) {
        throw new Error('Invalid password.');
    }

    const accessToken = helper.generateAccessToken(user);
    const refreshToken = await helper.generateRefreshToken(user._id);
    if (data.appToken) {
        user.appToken = data.appToken;
        await user.save();
    }
    return {accessToken, refreshToken};
}

export const newRefreshToken = async (data) => {
    const {refreshToken: refreshTokenUUID} = data;
    const refreshToken = await RefreshToken.findOne({token: refreshTokenUUID})
        .populate('user')
        .populate({
            path: 'user',
            populate: {path: 'branch', model: 'Branch'},
        })
        .populate({
            path: 'user',
            populate: {
                path: 'currentContract',
                populate: {path: 'officeShift', model: 'OfficeShift'},
            },
        });

    if (!refreshToken) {
        throw new Error('Invalid refresh token');
    }

    const isExpired = helper.verifyRefreshTokenExpiration(refreshToken);

    if (isExpired) {
        await RefreshToken.findByIdAndDelete(refreshToken._id).exec();
        throw new Error('Refresh token is expired');
    }

    await RefreshToken.findByIdAndDelete(refreshToken._id).exec();
    const newAccessToken = helper.generateAccessToken(refreshToken.user);
    const newRefreshToken = await helper.generateRefreshToken(refreshToken.user._id);

    return {accessToken: newAccessToken, refreshToken: newRefreshToken};
}