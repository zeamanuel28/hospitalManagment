import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import User from '@/backend/model/User';
import Appointment from '@/backend/model/Appointment';
import AssignDoc from '@/backend/model/AssignDoc';
import Diagnostic from '@/backend/model/Diagnostic';
import Prescription from '@/backend/model/Prescription';

export const GET = async (request, { params }) => {
  const {id}=params
  try {
    await connect ();

    const today = new Date();
    today.setHours(0,0,0,0);

    const user = await User.findOne({IdNo:id});


    const startOfWeek = new Date(today);
  startOfWeek.setHours(0,0,0,0);
  startOfWeek.setDate(startOfWeek.getDate());

  const weeklyPresciprion = [];
  const weeklyDiagnosticReq = [];
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
      physicianId: user._id,
      createdAt: {
        $gte: date,
        $lt: dateNext  
      }
    });


    //get prescription
    const pres = await Prescription.countDocuments({
      physicianId: user._id,
      createdAt: {
        $gte: date,
        $lt: dateNext  
      }
    });

    //get diagnostic request
    const diagnosticRequest = await Diagnostic.countDocuments({
      physicianId: user._id,
      createdAt: {
        $gte: date,
        $lt: dateNext  
      }
    });

    // Get patients count  
    const patients = await AssignDoc.countDocuments({
      physician: id,  
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

    weeklyDiagnosticReq.push({
      date: date.toDateString(),
      count: diagnosticRequest
    });

    weeklyPresciprion.push({
      date: date.toDateString(),
      count: pres
    });

  }


    const appointments = await Appointment.find({physicianId:user._id});
    const assigned = await AssignDoc.find({physician:id});
    const prescription = await Prescription.find({physicianId:user._id});
    const diagnosticRequest = await Diagnostic.find({physicianId:user._id});
    const todayappointments = await Appointment.find({physicianId:user._id,createdAt: {$gte: today}});
    const todayassigned = await AssignDoc.find({physician:id,createdAt: {$gte: today}});

    const results ={
        pendingApp: appointments.filter(a => a.status === 'Pending').length,
        cancelApp: appointments.filter(a => a.status === 'Canceled').length,
        completedApp: appointments.filter(a => a.status === 'Completed').length,

        todayPendingApp: todayappointments.filter(a => a.status === 'Pending').length,
        todayCancelApp: todayappointments.filter(a => a.status === 'Canceled').length,
        todayCompletedApp: todayappointments.filter(a => a.status === 'Completed').length,

        assignedPendingPatient: assigned.filter(a => a.status === 'Pending').length,
        assignedCompletedPatient: assigned.filter(a => a.status === 'Completed').length,

        todayAssignedPendingPatient: todayassigned.filter(a => a.status === 'Pending').length,
        todayAssignedCompletedPatient: todayassigned.filter(a => a.status === 'Completed').length,
        
        pendingRequest: diagnosticRequest.filter(a => a.status === 'Pending').length,
        completedRequest: diagnosticRequest.filter(a => a.status === 'Completed').length,

        pendingDrug: prescription.filter(a => a.status === 'Pending').length,
        completedDrug: prescription.filter(a => a.status === 'Completed').length,

        weeklyAppointments:weeklyAppointments.reverse(),
        weeklyDiagnosticReq:weeklyDiagnosticReq.reverse(),
        weeklyPresciprion:weeklyPresciprion.reverse(),
        weeklyPatients:weeklyPatients.reverse(),
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
