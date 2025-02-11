import {Setting} from "./setting.schema.js";

export const updateSettings = async (newSettings) => {
    try {
        const settings = await Setting.findOne();
        if (settings) {
            settings.siteName = newSettings.siteName || settings.siteName;
            settings.logo = newSettings.logo || settings.logo;
            settings.email = newSettings.email || settings.email;
            settings.oneSignal = newSettings.oneSignal || settings.oneSignal;
            await settings.save();
        } else {
            const newSetting = new Setting(newSettings);
            await newSetting.save();
        }
    } catch (error) {
        throw new Error("Error updating settings.");
    }
};

export const getSettings = async () => {
    try {
        return await Setting.findOne();
    } catch (error) {
        throw new Error("No settings Found.");
    }
}