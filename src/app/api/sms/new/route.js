import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import MessageModel from '@/backend/model/Message';
import User from '@/backend/model/User';

export const POST = async request => {
  const {
    message,
    subject,
    from,
    to,
  } = await request.json ();

  try {
    await connect ();
    let fromId=await User.findOne({IdNo:from})
    let toId=await User.findOne({IdNo:to})

    const newMessage = new MessageModel ({
        message,
        subject,
        from:fromId,
        to:toId,
    });
    await newMessage.save ();

    return new NextResponse (
      JSON.stringify ({message: 'Message Sent Succesfully'}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
