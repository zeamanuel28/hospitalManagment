import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import User from '@/backend/model/User';
import Diagnostic from '@/backend/model/Diagnostic';

export const POST = async request => {
  const {
    patientId,
    physicianId,
    test,
    bodyType,
    reason,
    priority,
    instructions,
  } = await request.json ();

  try {
    await connect ();
    let userId = await User.findOne ({IdNo: physicianId});
    if (!userId)
      return new NextResponse (JSON.stringify ({message: 'User Not Found'}), {
        status: 404,
      });

    const newDiagnostic = new Diagnostic ({
      patientId,
      physicianId: userId._id,
      test,
      bodyType,
      reason,
      priority,
      instructions,
    });
    await newDiagnostic.save ();

    return new NextResponse (
      JSON.stringify ({message: 'Diagnostic Created Succesfully'}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
