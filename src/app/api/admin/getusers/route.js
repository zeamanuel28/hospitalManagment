import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import User from '@/backend/model/User';
import env from '@/backend/config/env';


export const GET = async request => {

  try {
    await connect ();

    const users = await User.find().sort({_id:-1});
    return new NextResponse (
      JSON.stringify ({users}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
