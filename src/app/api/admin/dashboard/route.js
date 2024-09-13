import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import User from '@/backend/model/User';
import Appointment from '@/backend/model/Appointment';
import AssignDoc from '@/backend/model/AssignDoc';
import Diagnostic from '@/backend/model/Diagnostic';
import Prescription from '@/backend/model/Prescription';
import Patient from '@/backend/model/Patient';
import Payment from '@/backend/model/Payment';

export const GET = async (request) => {
  try {
    await connect ();

    const today = new Date();
    today.setHours(0,0,0,0);

  const startOfWeek = new Date(today);
  startOfWeek.setHours(0,0,0,0);
  startOfWeek.setDate(startOfWeek.getDate());

  const weeklyPresciprion = [];
  const weeklyDiagnosticReq = [];
  const weeklyAppointments = [];
  const weeklyAssigned = [];
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


    //get prescription
    const pres = await Prescription.countDocuments({
      createdAt: {
        $gte: date,
        $lt: dateNext  
      }
    });

    //get diagnostic request
    const diagnosticRequest = await Diagnostic.countDocuments({
      createdAt: {
        $gte: date,
        $lt: dateNext  
      }
    });

    // Get patients count  
    const patients = await Patient.countDocuments({
      createdAt: {
        $gte: date,
        $lt: dateNext
      }
    });

    const assigned = await AssignDoc.countDocuments({
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

    weeklyAssigned.push({
      date: date.toDateString(),
      count: assigned
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


    const patients = await Patient.find();
    const users = await User.find();
    const appointments = await Appointment.find();
    const todayappointments = await Appointment.find({createdAt: {$gte: today}});
    const assigned = await AssignDoc.find();
    const todayassigned = await AssignDoc.find({createdAt: {$gte: today}});

    const prescription = await Prescription.find();
    const todayprescription = await Prescription.find({createdAt: {$gte: today}});
    const diagnosticRequest = await Diagnostic.find();
    const todaydiagnosticRequest = await Diagnostic.find({createdAt: {$gte: today}});
    const payment = await Payment.find();
    const todaypayment = await Payment.find({createdAt: {$gte: today}});

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

        todaypendingRequest: todaydiagnosticRequest.filter(a => a.status === 'Pending').length,
        todaycompletedRequest: todaydiagnosticRequest.filter(a => a.status === 'Completed').length,

        pendingDrug: prescription.filter(a => a.status === 'Pending').length,
        completedDrug: prescription.filter(a => a.status === 'Completed').length,

        todaypendingPayment: todaypayment.filter(a => a.status === 'Pending').length,
        todayfailedPayment: todaypayment.filter(a => a.status === 'Fail').length,
        todaycompletedPayment: todaypayment.filter(a => a.status === 'Paid').length,

        pendingPayment: payment.filter(a => a.status === 'Pending').length,
        failedPayment: payment.filter(a => a.status === 'Fail').length,
        completedPayment: payment.filter(a => a.status === 'Paid').length,

        todaypendingDrug: todayprescription.filter(a => a.status === 'Pending').length,
        todaycompletedDrug: todayprescription.filter(a => a.status === 'Completed').length,

        activeusers: users.filter(a => a.status === 'Active').length,
        inactiveusers: users.filter(a => a.status === 'In Active').length,
        deletedusers: users.filter(a => a.status === 'Deleted').length,

        activepatient: patients.filter(a => a.status === 'Active').length,
        inactivepatient: patients.filter(a => a.status === 'In Active').length,

        weeklyAssigned:weeklyAssigned.reverse(),
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
