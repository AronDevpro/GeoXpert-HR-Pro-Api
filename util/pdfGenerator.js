import puppeteer from "puppeteer";
import * as path from "node:path";
import * as fs from "node:fs";

export const generatePayslipPDF = async (htmlContent, employeeName, period) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set content
    await page.setContent(htmlContent, { waitUntil: 'load' });

    // Define the PDF directory and ensure it exists
    const pdfDir = path.join(process.cwd(), 'assets/pdf-generated');
    if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir, { recursive: true });
    }

    // Define the PDF path
    const pdfPath = path.join(pdfDir, `payslip_${employeeName}_${period}.pdf`);

    // Generate PDF
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true
    });

    await browser.close();
    return pdfPath;
};