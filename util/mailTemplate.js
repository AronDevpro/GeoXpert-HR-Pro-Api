import {sendEmail} from "../config/mailer.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as fs from "node:fs";
import * as path from "node:path";

export const sendUserRegisterEmail = async (user) => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const templatePath = path.join(__dirname, './templates/userRegister.html');
        let htmlContent = fs.readFileSync(templatePath, 'utf-8');
        htmlContent = htmlContent
            .replace('{{name}}',user.firstName)

        await sendEmail(user.email, 'Welcome to SHRMS!', htmlContent);
    } catch (error) {
        console.error('Error sending registration email:', error);
        throw error;
    }
};