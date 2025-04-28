import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

export async function sendEmail(to: string, subject: string, html: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nqduy.dhti15a4hn@sv.uneti.edu.vn',
            pass: 'sahqvfawmrjcscij',
        },
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to,
            subject,
            html,
        });
        console.log('Email sent: ', info.response); // <-- thêm dòng này để biết có gửi được không
    } catch (error) {
        console.error('Send email failed:', error); // <-- in chính xác lỗi ra
        throw new Error('Không thể gửi email');
    }
}
