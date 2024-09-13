import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import User from '@/backend/model/User';

export const GET = async (request, { params }) => {
  const {id}=params
  try {
    await connect ();

    const user = await User.findOne({IdNo:id});
    return new NextResponse (
      JSON.stringify ({user}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
