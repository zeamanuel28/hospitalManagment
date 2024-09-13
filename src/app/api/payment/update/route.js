import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import Payment from '@/backend/model/Payment';

export const POST = async request => {
  const {status,id} = await request.json ();
  try {
    await connect ();
console.log(status,id)
    const payment = await Payment.findById(id);
    if (!payment) {
      return new NextResponse (JSON.stringify ({message: 'Not Found'}), {
        status: 403,
      });
    }

    (payment.status = status),(payment.updatedAt = Date.now ()), await payment.save (); // Update the updatedAt field with the current timestamp
    return new NextResponse (
      JSON.stringify ({message: `Payment ${status} Succesfully`}),
      {status: 200}
    );
  } catch (err) {
    return new NextResponse (JSON.stringify ({error: 'Database Error'}), {
      status: 500,
    });
  }
};
