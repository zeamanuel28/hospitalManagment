import env from '@/backend/config/env';
import nodemailer from 'nodemailer';

const PASSWORDP = env.PASSWORDP;
const EMAILP = env.EMAILP;

export async function sendMail (email, code, subject, msg) {
  try {
    // Create a transporter object using SMTP settings
    const transporter = nodemailer.createTransport ({
      service: 'gmail',
      auth: {
        user: EMAILP,
        pass: PASSWORDP,
      },
    });

    const mailOptions = {
      from: EMAILP,
      to: email,
      subject: subject,
      html: `
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  border: 1px solid #ccc;
                  border-radius: 5px;
                }
                .header {
                  text-align: center;
                  margin-bottom: 20px;
                }
                .code {
                  font-size: 24px;
                  font-weight: bold;
                  color: #007bff;
                }
                .footer {
                  margin-top: 20px;
                  text-align: center;
                  color: #777;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>${subject}</h2>
                  <p>Bensa Daye Hospital</p>
                </div>
                <p>${msg}: <span class="code">${code}</span></p>
                <div class="footer">
                  <p>Please use this code as needed.</p>
                </div>
              </div>
            </body>
          </html>
        `,
    };

    // Send the email
    const info = await transporter.sendMail (mailOptions);
  } catch (error) {
    console.log (error);
  }
}