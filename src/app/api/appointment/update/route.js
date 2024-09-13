import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import Appointment from '@/backend/model/Appointment';
import Schedule from '@/backend/model/Schedule';

export const POST = async request => {
    const {id,status,IdNo} = await request.json ();
  try {
    await connect ();
    if(!IdNo)return new NextResponse (
      JSON.stringify ({message:'User not Found'}),
      {status: 200}
    );

    const appointment = await  Appointment.findById(id);
    if(appointment.status==="Completed"||appointment.status==="Canceled")return new NextResponse (
      JSON.stringify ({message:'Appointment is closed'}),
      {status: 403}
    );

    if(status==="Completed"){
      appointment.status=status;
      appointment.updatedAt=Date.now();
      appointment.updatedBy=IdNo;

    }
    else if (status==="Cancel"){
      appointment.status="Canceled";
      appointment.updatedAt=Date.now();
      appointment.updatedBy=IdNo;

      const schedule=await Schedule.findOne({date:appointment.appointmentDate})
      const time = schedule.times.find(t => t.time === appointment.startTime);
      time.status = 'Open';
      await schedule.save()
    }
    

    await appointment.save()

    return new NextResponse (
      JSON.stringify ({message:'Appointment Updated'}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
