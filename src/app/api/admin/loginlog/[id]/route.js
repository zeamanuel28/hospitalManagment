import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import User from '@/backend/model/User';
import LoginLog from '@/backend/model/LoginLog';

export const GET = async (request, { params }) => {
  const {id}=params
  try {
    await connect ();

    const user = await User.findOne({IdNo:id});
    const logs=await LoginLog.find({user:user._id}).sort({_id:-1})
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
