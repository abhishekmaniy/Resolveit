import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

export const sendMail = async ({ to, subject, text, html }: {
    to: string;
    subject: string;
    text: string;
    html?: string;
}) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"My App" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (err) {
        console.error('Error sending mail:', err);
        throw err;
    }
};


