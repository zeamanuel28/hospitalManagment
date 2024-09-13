import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import User from '@/backend/model/User';

export const POST = async request => {
    const {IdNo} = await request.json ();
  try {
    await connect ();

    const user = await User.findOne({IdNo:IdNo});
    if(user.status==='Deleted')user.status='In Active'
    else user.status="Deleted"
    user.updatedAt=Date.now()
    await user.save()
    return new NextResponse (
      JSON.stringify ({message:'User Deleted'}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
