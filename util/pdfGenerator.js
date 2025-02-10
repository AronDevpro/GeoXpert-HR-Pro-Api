import puppeteer from "puppeteer";
import * as path from "node:path";

export const generatePayslipPDF = async (htmlContent, employeeName, period) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set content
    await page.setContent(htmlContent, { waitUntil: 'load' });

    // Define the PDF path
    const pdfPath = path.join(process.cwd(), `payslip_${employeeName}_${period}.pdf`);

    // Generate PDF
    await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true
    });

    await browser.close();
    return pdfPath;
};