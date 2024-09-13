import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import Appointment from '@/backend/model/Appointment';
import User from '@/backend/model/User';
import Payment from '@/backend/model/Payment';
import { generatePassword } from '@/helper/GeneratePassword';

export const POST = async request => {
  const {patientId, payFor, payType, pharmacy, amount} = await request.json ();

  try {
    await connect ();
    let user = await User.findOne ({IdNo: pharmacy});
    let IsPayment = await Payment.findOne ({payFor: payFor,status:"Pending"});
    if (IsPayment) {
      return new NextResponse (
        JSON.stringify ({message: 'Payment Request Already Sent Succesfully'}),
        {status: 403}
      );
    }

    let IsPaymentFail = await Payment.findOne ({payFor: payFor,status:"Fail"});
    if (IsPaymentFail) {
      IsPaymentFail.amount=amount;
      IsPaymentFail.status="Pending";

      await IsPaymentFail.save()
      
      return new NextResponse (
        JSON.stringify ({message: 'Payment Request Sent Succesfully'}),
        {status: 200}
      );
    }

    const newPaymentReq = new Payment ({
      patientId,
      payFor,
      payType,
      pharmacy: user._id,
      transactionId:'TID'+generatePassword(),
      amount,
    });
    await newPaymentReq.save ();

    return new NextResponse (
      JSON.stringify ({message: 'Payment Request Sent Succesfully'}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
