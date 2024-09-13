import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import MessageModel from '@/backend/model/Message';
import Patient from '@/backend/model/Patient';
import Feedback from '@/backend/model/Feedback';

export const POST = async request => {
  const {
    message,
    subject,
    from,
    type,
  } = await request.json ();

  try {
    await connect ();
    let fromId=await Patient.findOne({IdNo:from})

    const newMessage = new Feedback ({
        message,
        subject,
        from:fromId,
        type:type,
    });
    await newMessage.save ();

    return new NextResponse (
      JSON.stringify ({message: 'Feedback Sent Succesfully'}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
