import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import PatientLog from '@/backend/model/PatientLog';
import Patient from '@/backend/model/Patient';

export const GET = async (request, { params }) => {
  const {id}=params
  try {
    await connect ();

    const user = await Patient.findOne({IdNo:id});
    const logs=await PatientLog.find({user:user._id}).sort({_id:-1})
    return new NextResponse (
      JSON.stringify ({logs}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
