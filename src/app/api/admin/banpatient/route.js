import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import Patient from '@/backend/model/Patient';

export const POST = async request => {
    const {IdNo} = await request.json ();
  try {
    await connect ();

    const user = await Patient.findOne({IdNo:IdNo});
    if(user.status==='Active')user.status='In Active'
    else user.status='Active'
    await user.save()

    return new NextResponse (
      JSON.stringify ({message:'Patient Status Saved'}),
      {status: 200}
    );
  } catch (err) {
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
