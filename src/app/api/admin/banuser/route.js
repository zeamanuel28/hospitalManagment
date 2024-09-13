import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import User from '@/backend/model/User';
import env from '@/backend/config/env';

export const POST = async request => {
    const {IdNo} = await request.json ();
  try {
    await connect ();

    const user = await User.findOne({IdNo:IdNo});
    if(user.status==='Active')user.status='In Active'
    else user.status='Active'
    await user.save()

    return new NextResponse (
      JSON.stringify ({message:'User Status Saved'}),
      {status: 200}
    );
  } catch (err) {
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
