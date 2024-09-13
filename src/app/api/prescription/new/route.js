import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import Prescription from '@/backend/model/Prescription';
import User from '@/backend/model/User';

export const POST = async request => {
  const {patientId, physicianId, medications,instruction} = await request.json ();

  try {
    await connect ();
    let userId = await User.findOne ({IdNo: physicianId});
    if (!userId)
      return new NextResponse (JSON.stringify ({message: 'User Not Found'}), {
        status: 404,
      });

    const items = medications.map ((item, index) => ({
      name: item.name,
      dosage: item.dosage,
      quantity: item.quantity,
    }));

    const newPrescription = new Prescription ({
      patientId,
      physicianId: userId._id,
      medications:items,
      instruction:instruction,
    });
    await newPrescription.save ();

    return new NextResponse (
      JSON.stringify ({message: 'Prescription Created Succesfully'}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Medicine Detail Missing'}), {
      status: 500,
    });
  }
};
