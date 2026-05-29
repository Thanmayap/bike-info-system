const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
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
    
    const fast2smsKey = process.env.FAST2SMS_API_KEY;
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_PHONE_NUMBER;
    
    if (fast2smsKey) {
      try {
        console.log(`[Fast2SMS] Attempting to send SMS to ${identifier}...`);
        await sendSmsFast2SMS(fast2smsKey, identifier, otp);
        console.log(`[Fast2SMS] SMS successfully sent to ${identifier}`);
      } catch (err) {
        console.error(`[Fast2SMS ERROR] Failed to send SMS:`, err.message);
      }
    } else if (twilioSid && twilioAuth && twilioFrom) {
      try {
        console.log(`[Twilio] Attempting to send SMS to ${identifier}...`);
        await sendSmsTwilio(twilioSid, twilioAuth, twilioFrom, identifier, otp, purposeText);
        console.log(`[Twilio] SMS successfully sent to ${identifier}`);
      } catch (err) {
        console.error(`[Twilio ERROR] Failed to send SMS:`, err.message);
      }
    } else {
      console.log(`[SMS NOTIFICATION] To send real SMS OTPs: Add 'FAST2SMS_API_KEY' or Twilio credentials ('TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER') to your backend/.env file.`);
    }
  }
}

async function sendSmsFast2SMS(apiKey, phone, otp) {
  const cleanNumber = phone.replace('+91', '').trim();
  const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=otp&variables_values=${otp}&numbers=${cleanNumber}`;

  const https = require('https');
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.return) {
            resolve(parsed);
          } else {
            reject(new Error(parsed.message || 'Fast2SMS returned failure'));
          }
        } catch (e) {
          reject(new Error('Failed to parse Fast2SMS response'));
        }
      });
    }).on('error', reject);
  });
}

async function sendSmsTwilio(accountSid, authToken, fromPhone, toPhone, otp, purposeText) {
  const https = require('https');
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
  const postData = new URLSearchParams({
    To: toPhone,
    From: fromPhone,
    Body: `Your BikeIQ ${purposeText} OTP is ${otp}. It expires in 10 minutes.`,
  }).toString();

  const options = {
    hostname: 'api.twilio.com',
    port: 443,
    path: `/2010-04-01/Accounts/${accountSid}/Messages.json`,
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`Twilio returned HTTP ${res.statusCode}: ${body}`));
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

const exportsObj = { sendOtpEmail, sendOtp };
exportsObj.default = exportsObj;
module.exports = exportsObj;
