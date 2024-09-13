import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';

import Payment from '@/backend/model/Payment';

export const GET = async (request, { params }) => {
  const {id}=params
  try {
    await connect ();

    const paymentStatus = await Payment.findOne({payFor:id});
    return new NextResponse (
      JSON.stringify ({paymentStatus}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
