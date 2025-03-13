import {getSettings, publicSettings, updateSettings} from "./setting.service.js";

export const getSetting = async (req, res) => {
    try {
        const settings = await getSettings();
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPublicSetting = async (req, res) => {
    try {
        const settings = await publicSettings();
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const putSetting = async (req, res) => {
    try {
        await updateSettings(req.body);
        res.status(200).json({ message: "Data Updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};