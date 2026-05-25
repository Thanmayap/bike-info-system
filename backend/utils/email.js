const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

async function sendOtpEmail(to, otp) {
  if (!process.env.SMTP_USER) {
    console.log(`[DEV] OTP for ${to}: ${otp}`);
    return;
  }
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@bikes.com',
    to,
    subject: 'Your password reset OTP',
    html: `<h2>Bike Info System</h2><p>Your OTP is <b>${otp}</b>. It expires in 10 minutes.</p>`,
  });
}

const exportsObj = { sendOtpEmail };
exportsObj.default = exportsObj;
module.exports = exportsObj;
