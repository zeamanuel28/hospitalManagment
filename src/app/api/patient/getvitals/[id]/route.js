import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import Vitals from '@/backend/model/Vitals';

export const GET = async (request, { params }) => {
  const {id}=params
  try {
    await connect ();

    const vitals = await Vitals.find({patientId:id}).sort({_id:-1});
    return new NextResponse (
      JSON.stringify ({vitals}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
