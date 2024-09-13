import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import User from '@/backend/model/User';
import env from '@/backend/config/env';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

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


async function generateIdNo(role){
  // Get last id doc
  const lastDoc = await User.findOne({role: role}).sort({_id:-1})
  if(!lastDoc&&role==="pharmacy") return "PM-001";
  if(!lastDoc) return role.toUpperCase().substring(0,2) +"-001";
  // Extract dept code and number 
  const deptCode = lastDoc.IdNo.split("-")[0];
  let number = lastDoc.IdNo.split("-")[1];

  // Increment number
  number = parseInt(number) + 1;

  // Pad with zeros
  number = number.toString().padStart(3, '0');

  // Return new id
  return deptCode + "-" + number;
}

export const POST = async request => {
  const {email, role, fullName, phone, sex,department} = await request.json ();
console.log(department)
  try {
    await connect ();

    const user = await User.findOne ({email: email, role: role});
    if (user) {
      return new NextResponse (
        JSON.stringify ({message: 'User Email Existed'}),
        {status: 403}
      );
    }

    const password = '123456';
    const IdNo =await generateIdNo(role);
    const hashPassword = await bcrypt.hash (password, 10);

    const newUser = new User ({
      fullName: fullName,
      IdNo:IdNo,
      email: email,
      password: hashPassword,
      phone: phone,
      department:department,
      sex: sex,
      role: role,
    });
    await newUser.save ();

    await sendMail (
      email,
      password,
      'Your Dashboard Password',
      'Password : '
    );

    return new NextResponse (
      JSON.stringify ({message: 'User Created Succesfully'}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
