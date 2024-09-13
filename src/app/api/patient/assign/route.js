import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import AssignDoc from '@/backend/model/AssignDoc';

export const POST = async request => {
  const {
    patientId,
    priorty,
    department,
    physician,
    triage
  } = await request.json ();

  try {
    await connect ();

    const isAssigned= await AssignDoc.findOne({patientId:patientId,physician:physician,status:'Pending'})
    if (isAssigned){
    return new NextResponse (
      JSON.stringify ({message: 'Patient is On waitlist'}),
      {status: 403}
    );
  }

    const assignDoc = new AssignDoc ({
      patientId,
      priorty,
      department,
      physician,
      triage
    });
    await assignDoc.save ();

    return new NextResponse (
      JSON.stringify ({message: 'Physician Assigined Succesfully'}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
