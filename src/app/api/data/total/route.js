import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import Appointment from '@/backend/model/Appointment';
import AssignDoc from '@/backend/model/AssignDoc';
import Patient from '@/backend/model/Patient';

export const GET = async (request) => {
  try {
    await connect ();

    const appointments = await Appointment.find();
    const assigned = await AssignDoc.find();
    const patient = await Patient.find();

    const results ={
        PAppointments: appointments.filter(a => a.status === 'Pending').length,
        FAppointments: appointments.filter(a => a.status === 'Canceled').length,
        CAppointments: appointments.filter(a => a.status === 'Completed').length,
        PRequest: assigned.filter(a => a.status === 'Pending').length,
        CRequest: assigned.filter(a => a.status === 'Completed').length,
        PPatient: patient.filter(a => a.status === 'Active').length,
        CPatient: patient.filter(a => a.status === 'In Active').length,
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
