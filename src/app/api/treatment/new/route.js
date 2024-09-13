import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import User from '@/backend/model/User';
import Treatment from '@/backend/model/Treatment';

export const POST = async request => {
  const {
    patientId,
    physicianId,
    visitType,
    complaint,
    presentIllness,
    pastMedicalHistory,
    familyHistory,
    socialHistory,
    reviewOfSystems,
    emotional,
  } = await request.json ();

  try {
    await connect ();

    let userId = await User.findOne ({IdNo: physicianId});
    if (!userId)
      return new NextResponse (JSON.stringify ({message: 'User Not Found'}), {
        status: 404,
      });

    const newTreatment = new Treatment ({
      patientId,
      physicianId: userId._id,
      visitType,
      complaint,
      presentIllness,
      pastMedicalHistory,
      familyHistory,
      socialHistory,
      reviewOfSystems,
      emotional,
    });
    await newTreatment.save ();

    return new NextResponse (
      JSON.stringify ({message: 'Treatment Created Succesfully'}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
