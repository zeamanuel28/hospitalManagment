import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import MessageModel from '@/backend/model/Message';

export const POST = async request => {
  const {id} = await request.json ();
  try {
    await connect ();

    const message = await MessageModel.findById(id);
    if (!message) {
      return new NextResponse (JSON.stringify ({message: 'Not Found'}), {
        status: 403,
      });
    }

    (message.status = "Done"),(message.updatedAt = Date.now ()), await message.save (); // Update the updatedAt field with the current timestamp
    return new NextResponse (
      JSON.stringify ({message: 'Marked Read Succesfully'}),
      {status: 200}
    );
  } catch (err) {
    return new NextResponse (JSON.stringify ({error: 'Database Error'}), {
      status: 500,
    });
  }
};
