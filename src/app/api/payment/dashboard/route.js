import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import Payment from '@/backend/model/Payment';

export const GET = async (request) => {
  try {
    await connect ();

    const today = new Date();
    today.setHours(0,0,0,0);

    const startOfWeek = new Date(today);
  startOfWeek.setHours(0,0,0,0);
  startOfWeek.setDate(startOfWeek.getDate());

  const weeklyPayment = [];

  for(let i=0; i<=6; i++) {
     const date = new Date(startOfWeek);
    date.setDate(date.getDate() - i);
    // Get next date
    const dateNext = new Date(date);
    dateNext.setDate(dateNext.getDate() + 1);

    // Get appointments count
    const payment = await Payment.countDocuments({
      createdAt: {
        $gte: date,
        $lt: dateNext  
      }
    });

    weeklyPayment.push({
      date: date.toDateString(),
      count: payment
    });

  }


    const todayPayment = await Payment.find({createdAt: {$gte: today}});
    const totalPayment = await Payment.find();

    const results ={
        todayPaymentPending: todayPayment.filter(a => a.status === 'Pending').length,
        todayPaymentCompleted: todayPayment.filter(a => a.status === 'Paid').length,
        todayPaymentFail: todayPayment.filter(a => a.status === 'Fail').length,

        PaymentPending: totalPayment.filter(a => a.status === 'Pending').length,
        PaymentCompleted: totalPayment.filter(a => a.status === 'Paid').length,
        PaymentFail: totalPayment.filter(a => a.status === 'Fail').length,
        
        weeklyPayment:weeklyPayment.reverse(),
    }

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
