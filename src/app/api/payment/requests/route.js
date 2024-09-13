import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';

import Payment from '@/backend/model/Payment';

export const GET = async (request) => {
  try {
    await connect ();

    const payments = await Payment.find().populate('pharmacy','IdNo').populate('patientId','fullName IdNo').sort({_id:-1});

    const results= payments.map(doc => {
        return {
          _id: doc._id,
          fullName: doc.patientId.fullName,
          IdNo: doc.patientId.IdNo,
          userID: doc.pharmacy.IdNo,
          transactionId: doc.transactionId,
          payType: doc.payType,
          amount: doc.amount,
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
