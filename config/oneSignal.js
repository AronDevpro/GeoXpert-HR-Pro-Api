import * as OneSignal from '@onesignal/node-onesignal';
import {Setting} from "../features/setting/setting.schema.js";

const getConfigurationSettings = async () => {
    const settings = await Setting.findOne();
    if (!settings) {
        throw new Error("No settings found.");
    }
    return OneSignal.createConfiguration({
        userAuthKey: settings?.oneSignal?.userAuthKey,
        restApiKey: settings?.oneSignal?.restApiKey,
    })
};

export const sendNotification = async (data) => {
    const settings = await Setting.findOne();
    if (!settings) {
        throw new Error("No settings found.");
    }
    const configuration = await getConfigurationSettings();

    const client = new OneSignal.DefaultApi(configuration);
    const notification = {
        name: data.title,
        app_id: settings.oneSignal.appId,
        headings: {
            en: data.title
        },
        contents: {
            en: data.message
        },
        include_aliases: {
            onesignal_id: [data.appToken],
        },
        target_channel: "push",
        android_accent_color: "4177FF",
        small_icon: "ic_notification",
    };
    try {
        const response = await client.createNotification(notification);
        console.log('Notification sent successfully:', response);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};