import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import Patient from '@/backend/model/Patient';

export const GET = async (request, { params }) => {
  const {id}=params
  try {
    await connect ();

    const patient = await Patient.findOne({IdNo:id});
    return new NextResponse (
      JSON.stringify ({patient}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
