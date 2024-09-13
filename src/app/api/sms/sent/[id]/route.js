import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import User from '@/backend/model/User';
import MessageModel from '@/backend/model/Message';

export const GET = async (request, { params }) => {
  const {id}=params
  try {
    await connect ();

    let user=await User.findOne({IdNo:id})

    const sent = await MessageModel.find({from:user._id}).populate('to', 'IdNo fullName').sort({_id:-1});

    const sents= sent.map(doc => {
      return {
        _id: doc._id,
        fullName: doc.to.fullName,
        IdNo: doc.to.IdNo,
        subject: doc.subject,
        message: doc.message,
        status: doc.status,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      }
    });

    return new NextResponse (
      JSON.stringify ({sents}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
