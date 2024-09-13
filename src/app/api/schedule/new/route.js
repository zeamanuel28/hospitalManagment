import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import User from '@/backend/model/User';
import Schedule from '@/backend/model/Schedule';

export const POST = async request => {
  const {IdNo, date, times} = await request.json ();

  try {
    await connect ();

    const items = times.map ((item, index) => ({
      time: times[index],
      status: 'Open',
    }));

    let userId = await User.findOne ({IdNo: IdNo});
    let isDate = await Schedule.findOne ({date: date}); 

    const time = isDate?.times.find(t => t.status === "Taken");
    if(time)return new NextResponse (JSON.stringify ({message: 'Schedule In Use Can not Update'}), {
      status: 403,
    });

    if (isDate) {
      isDate.times = items;
      isDate.updatedAt = Date.now ();
      await isDate.save ();
      return new NextResponse (JSON.stringify ({message: 'Schedule Updated'}), {
        status: 200,
      });
    }

    const newSchedule = new Schedule ({
      userId: userId._id,
      date,
      times: items,
    });
    await newSchedule.save ();

    return new NextResponse (
      JSON.stringify ({message: 'Schedule Created Succesfully'}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Error in db'}), {
      status: 500,
    });
  }
};
