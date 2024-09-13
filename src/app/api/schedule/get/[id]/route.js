import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import Schedule from '@/backend/model/Schedule';
import User from '@/backend/model/User';

export const GET = async (request, { params }) => {
  const {id}=params
  try {
    await connect ();
    let userId = await User.findOne({IdNo: id});

    const result = await Schedule.find({userId:userId._id}).populate('userId','IdNo fullName').sort({_id:-1});

    const results= result.map(doc => {
      return {
        _id: doc._id,
        IdNo: doc.userId.IdNo,
        date: doc.date,
        times: doc.times,
        status: doc.status,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      }
    });

    return new NextResponse (
      JSON.stringify ({results}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
