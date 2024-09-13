import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import Appointment from '@/backend/model/Appointment';
import User from '@/backend/model/User';
import Schedule from '@/backend/model/Schedule';

export const POST = async request => {
  const {
    patientId,
    physician,
    appointmentBy,
    priority,
    appointmentDate,
    duration,
    startTime,
    description,
  } = await request.json ();

  try {
    await connect ();

    let user=await User.findOne({IdNo:physician})
    let user2=await User.findOne({IdNo:appointmentBy})
    
    let hasAppointment=await Appointment.findOne({patientId:patientId,physicianId:user._id,status:"Pending"})
    if (hasAppointment){
      return new NextResponse (
        JSON.stringify ({message: 'Patient have Pending Apppointment'}),
        {status: 403}
      );
    }

    let schedule=await Schedule.findOne({date:appointmentDate})
    let timeObj = schedule.times.find(t => t.time === startTime);
    timeObj.status = 'Taken'; 

    const IsFull=schedule.times.every(time => time.status === 'Taken')
    if(IsFull)schedule.status="Full"
    await schedule.save();


    const newAppointment = new Appointment ({
      patientId,
      appointmentBy:user2._id,
      physicianId:user._id,
      priority,
      appointmentDate,
      startTime,
      duration,
      description,
    });
    await newAppointment.save ();

    return new NextResponse (
      JSON.stringify ({message: 'Appointment Created Succesfully'}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
