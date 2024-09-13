import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import Appointment from '@/backend/model/Appointment';
import User from '@/backend/model/User';
import MessageModel from '@/backend/model/Message';
import { sendMail } from '@/helper/SendEmail';

export const GET = async (request, { params }) => {
  const {id}=params
  try {
    await connect ();

    const today = new Date();
    today.setHours(0,0,0,0);

    const user=await User.findOne({IdNo:id})
    if(!user)return new NextResponse (
      JSON.stringify ({message:`user not found`}),
      {status: 404}
    );
    const appointments = await Appointment.find({physicianId:user._id,appointmentDate:{$gte:today},status:'Pending'}).populate('physicianId',"fullName IdNo").populate('patientId',"email")
    if(!appointments||appointments.length<1)return new NextResponse (
      JSON.stringify ({message:'no appointment'}),
      {status: 404}
    );

    
    const message=await MessageModel.findOne({from:user._id,to:user._id,createdAt:today,message:`You Have ${appointments.length} appointments Tommowrow`})
    if(message)return new NextResponse (
      JSON.stringify ({message:`message sent already`}),
      {status: 403}
    );
    const newMessage = new MessageModel({
      message:`You Have ${appointments.length} appointments Tommowrow`,
      subject:"Reminder",
      from:user._id,
      to:user._id,
      createdAt:today
  });
  for(let x=0;x < appointments.length;x++){
    let email=appointments[x].patientId.email
    await sendMail (email, '', "Remider", `You have Appointment With physician ${appointments[x].physicianId.fullName} tommorow at ${appointments[x].startTime}Am O'clock`)
  }

  await newMessage.save ();

    return new NextResponse (
      JSON.stringify ({message:`You Have ${appointments.length} appointments Tommowrow`}),
      {status: 200}
    );


  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};

