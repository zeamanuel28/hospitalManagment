import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import User from '@/backend/model/User';
import LoginLog from '@/backend/model/LoginLog';

export const POST = async request => {
  const {
    IdNo,
    fullName,
    phone,
  } = await request.json ();
  try {
    await connect ();

    const user=await User.findOneAndUpdate (
      {IdNo: IdNo},
      {
        fullName,
        phone,
        updatedAt: Date.now (), // Update the updatedAt field with the current timestamp
      }
    );

    const newLog = new LoginLog ({
      type: "Update Profile",
      user: user._id,
    });
    await newLog.save ();
    await user.save()

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
