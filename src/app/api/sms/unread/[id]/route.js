import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import User from '@/backend/model/User';
import MessageModel from '@/backend/model/Message';

export const GET = async (request, { params }) => {
  const {id}=params
  try {
    await connect ();

    let user=await User.findOne({IdNo:id})

    const unreads = await MessageModel.countDocuments({to:user._id,status:'Pending'});

    return new NextResponse (
      JSON.stringify ({unreads}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
