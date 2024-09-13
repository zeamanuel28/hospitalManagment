import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import Schedule from '@/backend/model/Schedule';

export const POST = async (request) => {
  const {date} = await request.json ();
  
  try {
    await connect ();
console.log(date)
    let result = await Schedule.find({date: date,status:"Open"});
    const results= result.map(doc => {
      return {
        _id: doc._id,
        times: doc.times,
        status: doc.status,
      }
    });

    return new NextResponse (
      JSON.stringify ({results}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Error in db'}), {
      status: 500,
    });
  }
};
