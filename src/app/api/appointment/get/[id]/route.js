import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import Appointment from '@/backend/model/Appointment';
import User from '@/backend/model/User';
import Patient from '@/backend/model/Patient';

export const GET = async (request, { params }) => {
  const {id}=params
  try {
    await connect ();

    let user=await User.findOne({IdNo:id})

    const appointment = await Appointment.find({physicianId:user._id}).populate('appointmentBy', 'IdNo').populate('patientId', 'IdNo fullName').sort({_id:-1});

    const appointments= appointment.map(doc => {
      return {
        _id: doc._id,
        fullName: doc.patientId.fullName,
        IdNo: doc.patientId.IdNo,
        appointmentBy: doc.appointmentBy.IdNo,
        priority: doc.priority,
        appointmentDate: doc.appointmentDate,
        startTime: doc.startTime,
        duration: doc.duration,
        description: doc.description,
        status: doc.status,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        updatedBy: doc.updatedBy
      }
    });

    return new NextResponse (
      JSON.stringify ({appointments}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
