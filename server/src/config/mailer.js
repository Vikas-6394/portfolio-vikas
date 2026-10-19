import nodemailer from 'nodemailer';
import { ENV } from './env.js';

let transporter = null;

export const initMailer = () => {
  if (ENV.ENABLE_EMAIL && ENV.SMTP_USER && ENV.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: ENV.SMTP_HOST,
      port: ENV.SMTP_PORT,
      secure: ENV.SMTP_SECURE,
      auth: {
        user: ENV.SMTP_USER,
        pass: ENV.SMTP_PASS,
      },
    });
    console.log(`📧 Nodemailer configured with host: ${ENV.SMTP_HOST}:${ENV.SMTP_PORT}`);
  } else {
    console.log('ℹ️ Nodemailer is in simulation mode (ENABLE_EMAIL=false or credentials missing). Emails will be logged safely to console.');
  }
};

export const sendEnquiryNotificationEmail = async (enquiry) => {
  const mailSubject = `🔔 New Project Enquiry [${enquiry.referenceNumber}] from ${enquiry.fullName}`;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0b111e; color: #f8fafc; padding: 24px; }
        .card { background: #111c2e; border: 1px solid #1e293b; border-radius: 12px; padding: 28px; max-width: 600px; margin: 0 auto; }
        .badge { background: #0284c7; color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
        h2 { color: #38bdf8; margin-top: 0; font-size: 20px; }
        .row { margin-bottom: 14px; border-bottom: 1px solid #1e293b; padding-bottom: 8px; }
        .label { color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
        .val { color: #f8fafc; font-size: 15px; font-weight: 500; margin-top: 2px; }
        .desc-box { background: #0b111e; border: 1px solid #334155; border-radius: 8px; padding: 14px; color: #e2e8f0; line-height: 1.6; white-space: pre-wrap; margin-top: 6px; }
        .footer { font-size: 12px; color: #64748b; margin-top: 24px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="card">
        <span class="badge">New Enquiry</span>
        <h2>Project Enquiry Received</h2>
        <div class="row">
          <div class="label">Reference Number</div>
          <div class="val" style="color: #38bdf8; font-family: monospace;">${enquiry.referenceNumber}</div>
        </div>
        <div class="row">
          <div class="label">Client Name</div>
          <div class="val">${enquiry.fullName}</div>
        </div>
        <div class="row">
          <div class="label">Email Address</div>
          <div class="val"><a href="mailto:${enquiry.email}" style="color: #38bdf8;">${enquiry.email}</a></div>
        </div>
        <div class="row">
          <div class="label">Phone / WhatsApp</div>
          <div class="val">${enquiry.phone || 'Not provided'}</div>
        </div>
        <div class="row">
          <div class="label">Service Required</div>
          <div class="val">${enquiry.serviceRequired}</div>
        </div>
        <div class="row">
          <div class="label">Budget Range</div>
          <div class="val">${enquiry.budgetRange}</div>
        </div>
        <div class="row">
          <div class="label">Target Completion</div>
          <div class="val">${enquiry.expectedCompletionDate || 'Flexible'}</div>
        </div>
        ${enquiry.selectedTemplate ? `
        <div class="row">
          <div class="label">Selected Template</div>
          <div class="val" style="color: #a855f7;">${enquiry.selectedTemplate}</div>
        </div>` : ''}
        <div>
          <div class="label">Project Details</div>
          <div class="desc-box">${enquiry.projectDescription}</div>
        </div>
        <div class="footer">
          This enquiry was submitted on Mr. Vikas Maurya Portfolio Website (${new Date().toLocaleString()})
        </div>
      </div>
    </body>
    </html>
  `;

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: ENV.MAIL_FROM,
        to: ENV.CONTACT_RECIPIENT_EMAIL,
        replyTo: enquiry.email,
        subject: mailSubject,
        html: htmlBody,
      });
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error('❌ Failed to dispatch email via SMTP:', err.message);
      return { success: false, error: err.message };
    }
  } else {
    console.log(`\n======================================================`);
    console.log(`📬 [SIMULATED EMAIL DISPATCH] TO: ${ENV.CONTACT_RECIPIENT_EMAIL}`);
    console.log(`SUBJECT: ${mailSubject}`);
    console.log(`CLIENT: ${enquiry.fullName} (${enquiry.email})`);
    console.log(`SERVICE: ${enquiry.serviceRequired}`);
    console.log(`REFERENCE: ${enquiry.referenceNumber}`);
    console.log(`======================================================\n`);
    return { success: true, simulated: true };
  }
};

export const sendClientAcknowledgementEmail = async (enquiry) => {
  const mailSubject = `Thank you for contacting Mr. Vikas Maurya [Ref: ${enquiry.referenceNumber}]`;
  const htmlBody = `
    <div style="font-family: sans-serif; background: #0b111e; color: #f8fafc; padding: 24px; border-radius: 12px; max-width: 600px;">
      <h2 style="color: #38bdf8;">Hello ${enquiry.fullName},</h2>
      <p style="color: #cbd5e1; line-height: 1.6;">
        Thank you for reaching out regarding your project: <strong>${enquiry.serviceRequired}</strong>.
      </p>
      <p style="color: #cbd5e1; line-height: 1.6;">
        I have received your enquiry (Ref: <code style="color: #38bdf8;">${enquiry.referenceNumber}</code>) and will review your specifications carefully. You can expect a response within 24 hours.
      </p>
      <p style="color: #94a3b8; font-size: 14px; margin-top: 24px;">
        Best regards,<br>
        <strong>Mr. Vikas Maurya</strong><br>
        Web Developer | MERN Stack Developer
      </p>
    </div>
  `;

  if (transporter && enquiry.email) {
    try {
      await transporter.sendMail({
        from: ENV.MAIL_FROM,
        to: enquiry.email,
        subject: mailSubject,
        html: htmlBody,
      });
    } catch (err) {
      console.warn('Could not send client acknowledgment email:', err.message);
    }
  }
};

export const sendOtpEmail = async (email, otpCode, recipientName = 'Valued Client') => {
  const mailSubject = `🔐 Your Verification Code: ${otpCode} — Mr. Vikas Maurya Portfolio`;
  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b111e; color: #f8fafc; padding: 28px; border-radius: 12px; max-width: 540px; margin: 0 auto; border: 1px solid #1e293b;">
      <h2 style="color: #38bdf8; margin-top: 0;">Verify Your Contact Details</h2>
      <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
        Hello ${recipientName},<br>
        Please use the 6-digit verification code below to verify your project enquiry on Mr. Vikas Maurya's portfolio website.
      </p>
      <div style="background: #111c2e; border: 2px dashed #0284c7; border-radius: 10px; padding: 18px; text-align: center; margin: 24px 0;">
        <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #38bdf8; font-family: monospace;">${otpCode}</span>
        <p style="color: #94a3b8; font-size: 12px; margin: 8px 0 0 0;">This code is valid for 5 minutes. Do not share it with anyone.</p>
      </div>
      <p style="color: #64748b; font-size: 12px; margin-top: 24px;">
        If you did not initiate this request, you can safely disregard this email.
      </p>
    </div>
  `;

  if (transporter && email) {
    try {
      await transporter.sendMail({
        from: ENV.MAIL_FROM,
        to: email,
        subject: mailSubject,
        html: htmlBody,
      });
      console.log(`📧 OTP Email dispatched to: ${email}`);
    } catch (err) {
      console.warn('Could not dispatch OTP email via SMTP:', err.message);
    }
  } else {
    console.log(`\n======================================================`);
    console.log(`🔐 [SIMULATED OTP DISPATCH] TO: ${email}`);
    console.log(`CODE: ${otpCode}`);
    console.log(`EXPIRES IN: 5 minutes`);
    console.log(`======================================================\n`);
  }
};

