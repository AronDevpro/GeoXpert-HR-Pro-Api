import {sendEmail, sendEmailWithAttachment} from "../config/mailer.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as fs from "node:fs";
import * as path from "node:path";
import {generatePayslipPDF} from "./pdfGenerator.js";

export const sendUserRegisterEmail = async (user) => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const templatePath = path.join(__dirname, './templates/userRegister.html');
        let htmlContent = fs.readFileSync(templatePath, 'utf-8');
        htmlContent = htmlContent
            .replace('{{name}}',user.firstName)

        await sendEmail(user.email, 'Welcome to GeoXpert HR Pro!', htmlContent);
    } catch (error) {
        console.error('Error sending registration email:', error);
        throw error;
    }
};

export const sendPayslipEmail = async (user) => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const templatePath = path.join(__dirname, './templates/paySlip.html');
        let htmlContent = fs.readFileSync(templatePath, 'utf-8');

        htmlContent = htmlContent
            .replace('{{name}}', user.empId.firstName + ' ' + user.empId.lastName)
            .replace('{{email}}', user.empId.email)
            .replace('{{period}}', user.period)
            .replace('{{designation}}', user.empId.currentContract?.designation || "N/A")
            .replace('{{department}}', user.empId.currentContract?.department || "N/A")
            .replace('{{basicSalary}}', user.basicSalary)
            .replace('{{netSalary}}', user.netSalary)
            .replace('{{allowanceTotal}}', user.allowance)
            .replace('{{deductionTotal}}', user.deduction);

        let allowancesHTML = '';
        user.allowanceTypes.forEach(item => {
            allowancesHTML += `
        <div class="item">
          <span>${item.name}</span>
          <span>${item.amount}</span>
        </div>
      `;
        });

        let deductionsHTML = '';
        user.deductionTypes.forEach(item => {
            deductionsHTML += `
        <div class="item">
          <span>${item.name}</span>
          <span>${item.amount}</span>
        </div>
      `;
        });

        htmlContent = htmlContent
            .replace('{{allowances}}', allowancesHTML)
            .replace('{{deductions}}', deductionsHTML);

        // Generate PDF from HTML
        const pdfPath = await generatePayslipPDF(htmlContent, user.empId.firstName, user.period);

        // Send Email with PDF attachment
        return await sendEmailWithAttachment(user.empId.email, `Pay Slip for ${user.period}`, "Please find attached your payslip.", pdfPath);
    } catch (error) {
        console.error('Error sending payslip email:', error);
        throw error;
    }
};