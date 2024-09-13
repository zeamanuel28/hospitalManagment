import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import Appointment from '@/backend/model/Appointment';
import AssignDoc from '@/backend/model/AssignDoc';
import Patient from '@/backend/model/Patient';

export const GET = async (request) => {
  try {
    await connect ();

    const today = new Date();
    today.setHours(0,0,0,0);

    const startOfWeek = new Date(today);
  startOfWeek.setHours(0,0,0,0);
  startOfWeek.setDate(startOfWeek.getDate());

  const weeklyAppointments = [];
  const weeklyPatients = [];

  for(let i=0; i<=6; i++) {
     const date = new Date(startOfWeek);
    date.setDate(date.getDate() - i);
    // Get next date
    const dateNext = new Date(date);
    dateNext.setDate(dateNext.getDate() + 1);

    // Get appointments count
    const apps = await Appointment.countDocuments({
      createdAt: {
        $gte: date,
        $lt: dateNext  
      }
    });

    // Get patients count  
    const patients = await AssignDoc.countDocuments({
      createdAt: {
        $gte: date,
        $lt: dateNext
      }
    });

    weeklyAppointments.push({
      date: date.toDateString(), 
      count: apps
    });

    weeklyPatients.push({
      date: date.toDateString(),
      count: patients
    });

  }


    const appointments = await Appointment.find();
    const patient = await Patient.find();
    const todayappointments = await Appointment.find({createdAt: {$gte: today}});
    const todayassigned = await AssignDoc.find({createdAt: {$gte: today}});

    const results ={
        pendingApp: appointments.filter(a => a.status === 'Pending').length,
        cancelApp: appointments.filter(a => a.status === 'Canceled').length,
        completedApp: appointments.filter(a => a.status === 'Completed').length,

        todayPendingApp: todayappointments.filter(a => a.status === 'Pending').length,
        todayCancelApp: todayappointments.filter(a => a.status === 'Canceled').length,
        todayCompletedApp: todayappointments.filter(a => a.status === 'Completed').length,

        inActivePatient: patient.filter(a => a.status === 'In Active').length,
        activePatient: patient.filter(a => a.status === 'Active').length,

        todayAssignedPendingPatient: todayassigned.filter(a => a.status === 'Pending').length,
        todayAssignedCompletedPatient: todayassigned.filter(a => a.status === 'Completed').length,
        
        weeklyAppointments:weeklyAppointments.reverse(),
        weeklyPatients:weeklyPatients.reverse()
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
