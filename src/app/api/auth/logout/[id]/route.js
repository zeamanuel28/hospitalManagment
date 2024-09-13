import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import User from '@/backend/model/User';
import LoginLog from '@/backend/model/LoginLog';

export const GET = async (request, { params }) => {
  const {id}=params
  try {
    await connect ();

    const user = await User.findOne({IdNo:id});
    const newLog = new LoginLog ({
        type: "Logout",
        user: user._id,
      });
    await newLog.save ();

    return new NextResponse (
      JSON.stringify ({message:'Logout Success'}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
