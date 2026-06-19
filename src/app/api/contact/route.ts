import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid submission data' }, { status: 400 });
    }

    // 1. Resolve Recipient Email List
    const recipientEmailsEnv = process.env.CONTACT_RECIPIENT_EMAILS || process.env.ADMIN_EMAIL || 'admin@etherealspaces.com';
    // Split by comma and filter empty emails
    const recipients = recipientEmailsEnv
      .split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0);

    if (recipients.length === 0) {
      recipients.push('admin@etherealspaces.com');
    }

    // 2. Build HTML and Plain Text email representations
    const dateStr = new Date().toLocaleString('en-US', { timeZone: 'UTC' });
    const formattedFields = Object.entries(body)
      .map(([key, val]) => {
        const formattedKey = key
          .replace(/_/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase());
        return { label: formattedKey, value: String(val) };
      });

    const emailSubject = `[New Lead] Spatial Design Inquiry — ${body.name || 'Anonymous'}`;

    // Plain text body representation
    const plainTextBody = `
Ethereal Spaces — New Spatial Design Inquiry
Submitted on: ${dateStr} UTC

Details:
${formattedFields.map(f => `${f.label}: ${f.value}`).join('\n')}

This lead has been compiled and forwarded automatically.
`;

    // HTML body representation (editorial layout)
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #F6F4EE;
      color: #1C1B1A;
      margin: 0;
      padding: 40px 20px;
    }
    .email-container {
      background-color: #FFFFFF;
      border: 1px solid rgba(28, 27, 26, 0.08);
      border-radius: 16px;
      max-width: 580px;
      margin: 0 auto;
      padding: 40px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.02);
    }
    .header-logo {
      font-family: Georgia, serif;
      font-size: 20px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #C5A265;
      border-bottom: 1px solid rgba(28, 27, 26, 0.06);
      padding-bottom: 24px;
      margin-bottom: 32px;
      text-align: center;
    }
    .title {
      font-family: Georgia, serif;
      font-size: 24px;
      font-weight: 300;
      margin-top: 0;
      margin-bottom: 8px;
      color: #1C1B1A;
    }
    .subtitle {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: rgba(28, 27, 26, 0.45);
      margin-bottom: 32px;
    }
    .field-row {
      margin-bottom: 24px;
    }
    .field-label {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #C5A265;
      font-weight: 600;
      margin-bottom: 6px;
    }
    .field-value {
      font-size: 13px;
      line-height: 1.6;
      color: #2D2C2A;
    }
    .footer {
      text-align: center;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: rgba(28, 27, 26, 0.35);
      border-top: 1px solid rgba(28, 27, 26, 0.06);
      padding-top: 24px;
      margin-top: 40px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header-logo">Ethereal Spaces</div>
    
    <h2 class="title">Design Inquiry</h2>
    <div class="subtitle">Submitted on ${dateStr} UTC</div>
    
    <div style="margin-bottom: 32px;">
      ${formattedFields.map(f => `
        <div class="field-row">
          <div class="field-label">${f.label}</div>
          <div class="field-value">${f.value.replace(/\n/g, '<br />')}</div>
        </div>
      `).join('')}
    </div>
    
    <div class="footer">
      Turnkey Luxury Curation / Geneva • London • New York • Vienna
    </div>
  </div>
</body>
</html>
`;

    // 3. Resolve Mail Transporter Settings
    const smtpHost = process.env.SMTP_HOST || '';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpUser = process.env.SMTP_USER || '';
    const smtpPass = process.env.SMTP_PASS || '';
    const smtpFrom = process.env.SMTP_FROM || 'concierge@etherealspaces.com';

    // 4. Send or Simulate Email
    if (smtpHost.trim().length > 0) {
      // SMTP Configured - Attempt real transmission
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      await transporter.sendMail({
        from: smtpFrom,
        to: recipients.join(', '),
        subject: emailSubject,
        text: plainTextBody,
        html: htmlBody
      });

      console.log(`[Email Success] Real email sent to: ${recipients.join(', ')}`);
      return NextResponse.json({ success: true, mode: 'real', recipients });
    } else {
      // SMTP Not Configured - Run in simulator mode
      const separator = '='.repeat(60);
      const simulatorOutput = `
${separator}
[SMTP EMAIL SIMULATOR] — Leads Forwarding
SMTP Credentials not configured in .env. Logging email transmission details:

From: ${smtpFrom}
To: ${recipients.join(', ')}
Subject: ${emailSubject}

--- PLAIN TEXT BODY ---
${plainTextBody}
${separator}
`;
      console.log(simulatorOutput);

      // Save a local copy in the workspace directory under public/scratch/email_leads
      try {
        const scratchDir = path.join(process.cwd(), 'public', 'scratch', 'email_leads');
        if (!fs.existsSync(scratchDir)) {
          fs.mkdirSync(scratchDir, { recursive: true });
        }
        const fileName = `lead-${Date.now()}.json`;
        const filePath = path.join(scratchDir, fileName);
        
        fs.writeFileSync(filePath, JSON.stringify({
          timestamp: new Date().toISOString(),
          subject: emailSubject,
          from: smtpFrom,
          to: recipients,
          data: body,
          plainText: plainTextBody
        }, null, 2));

        console.log(`[Email Simulator Backup] Saved lead backup to: public/scratch/email_leads/${fileName}`);
      } catch (writeErr) {
        console.error('Failed to write local backup email log:', writeErr);
      }

      return NextResponse.json({ success: true, mode: 'simulated', recipients });
    }

  } catch (err: any) {
    console.error('Error handling lead submission API:', err);
    return NextResponse.json({ error: err.message || 'Server error processing contact lead' }, { status: 500 });
  }
}
