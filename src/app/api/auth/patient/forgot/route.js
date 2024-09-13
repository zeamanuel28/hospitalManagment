import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import User from '@/backend/model/User';
import env from '@/backend/config/env';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import Patient from '@/backend/model/Patient';
import PatientLog from '@/backend/model/PatientLog';

const PASSWORDP = env.PASSWORDP;
const EMAILP = env.EMAILP;

async function sendMail (email, code, subject, msg) {
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

function generatePassword () {
  const capitalLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const smallLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '0123456789';

  let password = '';

  // Generate at least one character from each category
  password += getRandomCharacter (capitalLetters);
  password += getRandomCharacter (smallLetters);
  password += getRandomCharacter (numbers);
  password += getRandomCharacter (symbols);

  // Generate the remaining characters randomly
  for (let i = 4; i < 8; i++) {
    const characterType = getRandomInt (4); // 0: capital letter, 1: small letter, 2: number, 3: symbol

    switch (characterType) {
      case 0:
        password += getRandomCharacter (capitalLetters);
        break;
      case 1:
        password += getRandomCharacter (smallLetters);
        break;
      case 2:
        password += getRandomCharacter (numbers);
        break;
      case 3:
        password += getRandomCharacter (symbols);
        break;
    }
  }

  return password;
}

function getRandomCharacter (characterSet) {
  const randomIndex = getRandomInt (characterSet.length);
  return characterSet.charAt (randomIndex);
}

function getRandomInt (max) {
  return Math.floor (Math.random () * Math.floor (max));
}


export const POST = async request => {
  const {email} = await request.json ();
  try {
    await connect ();

    const user = await Patient.findOne ({email: email});
    if (!user) {
      return new NextResponse (
        JSON.stringify ({message: "User Email Doesn't Existed"}),
        {status: 403}
      );
    }

    const password = '1234567';
    const hashPassword = await bcrypt.hash (password, 10);

    user.password=hashPassword
    await user.save ();

    await sendMail (
      email,
      password,
      'Your Changed Dashboard Password',
      'Password : '
    );

    const newLog = new PatientLog ({
      type: "Forget Password",
      user: user._id,
    });
    await newLog.save ();
    return new NextResponse (
      JSON.stringify ({message: 'Reset Password Succesfully'}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
