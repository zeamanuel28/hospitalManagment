import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import Patient from '@/backend/model/Patient';

export const POST = async request => {
  const {
    IdNo,
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

    await Patient.findOneAndUpdate (
      {IdNo: IdNo},
      {
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
        updatedAt: Date.now (), // Update the updatedAt field with the current timestamp
      }
    );

    return new NextResponse (
      JSON.stringify ({message: 'Patient Updated Succesfully'}),
      {status: 200}
    );
  } catch (err) {
    return new NextResponse (JSON.stringify ({error: 'Database Error'}), {
      status: 500,
    });
  }
};
