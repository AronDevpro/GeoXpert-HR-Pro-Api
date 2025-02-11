import nodemailer from "nodemailer";
import * as path from "node:path";
import {Setting} from "../features/setting/setting.schema.js";

const getEmailSettings = async () => {
    const settings = await Setting.findOne();
    if (!settings) {
        throw new Error("No settings found.");
    }

    return nodemailer.createTransport({
        host: settings?.email.host,
        port: settings?.email.port,
        secure: settings?.email.secure,
        auth: {
            user: settings?.email.user,
            pass: settings?.email.pass,
        },
    });
};

export const sendEmail = async (to, subject, htmlContent) => {
    try {
        const transporter = await getEmailSettings();
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: htmlContent
        };
        return await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export const sendEmailWithAttachment = async (to, subject, text, pdfPath) => {
    try {
        const transporter = await getEmailSettings();
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            attachments: [
                {
                    filename: path.basename(pdfPath),
                    path: pdfPath,
                    contentType: 'application/pdf'
                }
            ]
        };

        // Send email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};