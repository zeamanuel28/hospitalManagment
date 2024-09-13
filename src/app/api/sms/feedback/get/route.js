import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import Feedback from '@/backend/model/Feedback';

export const GET = async (request, { params }) => {
  try {
    await connect ();

    const inbox = await Feedback.find({type:'Patient'}).populate('from', 'IdNo fullName').sort({_id:-1});

    const inboxs= inbox.map(doc => {
      return {
        _id: doc._id,
        fullName: doc.from.fullName,
        IdNo: doc.from.IdNo,
        subject: doc.subject,
        message: doc.message,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      }
    });

    return new NextResponse (
      JSON.stringify ({inboxs}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
