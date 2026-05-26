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
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@bikes.com',
      to,
      subject: 'Your password reset OTP',
      html: `<h2>Bike Info System</h2><p>Your OTP is <b>${otp}</b>. It expires in 10 minutes.</p>`,
    });
  } catch (err) {
    console.error(`[SMTP ERROR] Failed to send email to ${to}:`, err.message);
    console.log(`[DEV FALLBACK] OTP for ${to}: ${otp}`);
  }
}

async function sendOtp(identifier, otp, purpose = 'reset') {
  const isEmail = identifier.includes('@');
  const purposeText = purpose === 'reset' ? 'Password Reset' : purpose === 'register' ? 'Registration' : 'Login';
  
  if (isEmail) {
    if (!process.env.SMTP_USER) {
      console.log(`[DEV] [EMAIL] OTP for ${identifier} (${purposeText}): ${otp}`);
      return;
    }
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'no-reply@bikes.com',
        to: identifier,
        subject: `Your Bike IQ ${purposeText} OTP`,
        html: `<h2>Bike Info System</h2><p>Your ${purposeText} OTP is <b>${otp}</b>. It expires in 10 minutes.</p>`,
      });
      console.log(`[SMTP] Successfully sent OTP email to ${identifier}`);
    } catch (err) {
      console.error(`[SMTP ERROR] Failed to send email to ${identifier}:`, err.message);
      console.log(`[DEV FALLBACK] [EMAIL] OTP for ${identifier} (${purposeText}): ${otp}`);
      // Do not block in dev or local runs, only throw in actual production
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Failed to send OTP email: ${err.message}`);
      }
    }
  } else {
    // Phone SMS OTP
    console.log(`[DEV] [SMS] OTP for ${identifier} (${purposeText}): ${otp}`);
  }
}

const exportsObj = { sendOtpEmail, sendOtp };
exportsObj.default = exportsObj;
module.exports = exportsObj;
