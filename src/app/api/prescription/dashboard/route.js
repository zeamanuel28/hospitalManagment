import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import User from '@/backend/model/User';
import Appointment from '@/backend/model/Appointment';
import AssignDoc from '@/backend/model/AssignDoc';
import Diagnostic from '@/backend/model/Diagnostic';
import Prescription from '@/backend/model/Prescription';
import Patient from '@/backend/model/Patient';

export const GET = async (request) => {
  try {
    await connect ();

    const today = new Date();
    today.setHours(0,0,0,0);

    const startOfWeek = new Date(today);
  startOfWeek.setHours(0,0,0,0);
  startOfWeek.setDate(startOfWeek.getDate());

  const weeklyPrescription = [];

  for(let i=0; i<=6; i++) {
     const date = new Date(startOfWeek);
    date.setDate(date.getDate() - i);
    // Get next date
    const dateNext = new Date(date);
    dateNext.setDate(dateNext.getDate() + 1);

    // Get appointments count
    const prescription = await Prescription.countDocuments({
      createdAt: {
        $gte: date,
        $lt: dateNext  
      }
    });

    weeklyPrescription.push({
      date: date.toDateString(),
      count: prescription
    });

  }


    const todayPrescription = await Prescription.find({createdAt: {$gte: today}});
    const totalPrescription = await Prescription.find();

    const results ={
        todayPrescriptionPending: todayPrescription.filter(a => a.status === 'Pending').length,
        todayPrescriptionCompleted: todayPrescription.filter(a => a.status === 'Completed').length,

        prescriptionPending: totalPrescription.filter(a => a.status === 'Pending').length,
        prescriptionCompleted: totalPrescription.filter(a => a.status === 'Completed').length,
        
        weeklyPrescription:weeklyPrescription.reverse(),
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
