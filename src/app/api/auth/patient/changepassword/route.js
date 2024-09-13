import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import bcrypt from 'bcrypt';
import Patient from '@/backend/model/Patient';
import PatientLog from '@/backend/model/PatientLog';

export const POST = async request => {
  const {IdNo, oldPassword, newPassword} = await request.json ();
  try {
    await connect ();

    const user = await Patient.findOne ({IdNo: IdNo});
    if (!user) {
      return new NextResponse (JSON.stringify ({message: 'User Not Found'}), {
        status: 403,
      });
    }

    const match = await bcrypt.compare (oldPassword, user.password);

    if (!match) {
      return new NextResponse (JSON.stringify ({message: 'Invalid Password'}), {
        status: 403,
      });
    }

    const hashPassword = await bcrypt.hash (newPassword, 10);

    (user.password = hashPassword), (user.updatedAt = Date.now ()), await user.save (); // Update the updatedAt field with the current timestamp
    const newLog = new PatientLog ({
      type: "Change Password",
      user: user._id,
    });
    await newLog.save ();

    return new NextResponse (
      JSON.stringify ({message: 'Password Updated Succesfully'}),
      {status: 200}
    );
  } catch (err) {
    return new NextResponse (JSON.stringify ({error: 'Database Error'}), {
      status: 500,
    });
  }
};
