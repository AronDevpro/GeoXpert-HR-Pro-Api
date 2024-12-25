import nodemailer from "nodemailer";


export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "kp0552701@gmail.com",
        pass: "doeg xwbi meoa qrim",
    },
});

export const sendEmail = async (to, subject, htmlContent) => {
    try {
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