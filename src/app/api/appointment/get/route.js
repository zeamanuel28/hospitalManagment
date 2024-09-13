import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import Appointment from '@/backend/model/Appointment';

export const GET = async (request) => {
  try {
    await connect ();

    const appointment = await Appointment.find().populate('physicianId', 'IdNo').populate('appointmentBy', 'IdNo').populate('patientId', 'IdNo fullName').sort({_id:-1});

    const appointments= appointment.map(doc => {
      return {
        _id: doc._id,
        fullName: doc.patientId.fullName,
        IdNo: doc.patientId.IdNo,
        physician: doc.physicianId.IdNo,
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
