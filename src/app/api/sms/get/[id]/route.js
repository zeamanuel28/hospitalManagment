import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import User from '@/backend/model/User';
import MessageModel from '@/backend/model/Message';

export const GET = async (request, { params }) => {
  const {id}=params
  try {
    await connect ();

    let user=await User.findOne({IdNo:id})

    const inbox = await MessageModel.find({to:user._id}).populate('from', 'IdNo fullName').sort({_id:-1});

    const inboxs= inbox.map(doc => {
      return {
        _id: doc._id,
        fullName: doc.from.fullName,
        IdNo: doc.from.IdNo,
        subject: doc.subject,
        message: doc.message,
        status: doc.status,
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
