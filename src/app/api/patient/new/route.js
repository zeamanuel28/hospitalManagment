import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import Patient from '@/backend/model/Patient';
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
  const smallLetters = 'abcdefghijklmnopqrstuvwxyz';
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


async function generateIdNo() {

  const deptCode = 'MFP';

  let idNumber;

  const lastDoc = await Patient.findOne()
    .sort({_id:-1});

  if(lastDoc) {

    idNumber = lastDoc.IdNo.split("-")[1];
    idNumber = parseInt(idNumber) + 1;

  } else {

    idNumber = '0001';

  }

  idNumber = idNumber.toString().padStart(4, '0');

  return deptCode + "-" + idNumber;

}

export const POST = async request => {
  const {
    fullName,
    sex,
    dateOfBirth,
    bloodType,
    email,
    phone,
    city,
    subCity,
    emergencyContactName,
    emergencyContactPhone,
    emergencyContactRelationship,
  } = await request.json ();

  try {
    await connect ();

    const patient = await Patient.findOne ({$or: [
      { phone },
      { email } 
    ]});
    if (patient) {
      return new NextResponse (
        JSON.stringify ({message: 'Patient Phone or Email Existed'}),
        {status: 403}
      );
    }

    const password = generatePassword ();
    const IdNo =await generateIdNo();
    const hashPassword = await bcrypt.hash (password, 10);

    const newPatient = new Patient ({
      fullName,
      IdNo,
      sex,
      dateOfBirth,
      bloodType,
      password: hashPassword,
      email,
      phone,
      city,
      subCity,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
    });
    await newPatient.save ();

    if(email!=='')
    await sendMail (email, password, 'Your Patient Dashboard Login Password', 'Password : ');

    return new NextResponse (
      JSON.stringify ({message: 'Patient Created Succesfully'}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
