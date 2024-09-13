import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import User from '@/backend/model/User';

export const GET = async (request, { params }) => {
  const {dep,role}=params
  try {
    await connect ();
    let names;
    if(dep!=='none') names = await User.find({role:role,department:dep});
    else names = await User.find({role:role});
    return new NextResponse (
      JSON.stringify ({names}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
