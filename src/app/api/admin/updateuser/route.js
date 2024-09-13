import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import User from '@/backend/model/User';

export const POST = async request => {
  const {
    IdNo,
    role,
    department,
    email,
    phone,
  } = await request.json ();
  try {
    await connect ();
    let dep=((role!=='physicians')?null:department);

    await User.findOneAndUpdate (
      {IdNo: IdNo},
      {
        email,
        phone,
        role,
        department:dep,
        updatedAt: Date.now (), // Update the updatedAt field with the current timestamp
      }
    );

    return new NextResponse (
      JSON.stringify ({message: 'User Updated Succesfully'}),
      {status: 200}
    );
  } catch (err) {
    return new NextResponse (JSON.stringify ({error: 'Database Error'}), {
      status: 500,
    });
  }
};
