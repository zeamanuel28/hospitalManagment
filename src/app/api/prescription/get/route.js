import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import Prescription from '@/backend/model/Prescription';

export const GET = async (request) => {
  try {
    await connect ();

    const result = await Prescription.find().populate('patientId','_id IdNo fullName sex dateOfBirth').populate('physicianId','IdNo').sort({_id:-1});

    const results= result.map(doc => {
      return {
        _id: doc._id,
        PId: doc.patientId._id,
        fullName: doc.patientId.fullName,
        IdNo: doc.patientId.IdNo,
        dateOfBirth: doc.patientId.dateOfBirth,
        sex: doc.patientId.sex,
        physicianId: doc.physicianId.IdNo,
        medications: doc.medications,
        instruction: doc.instruction,
        status: doc.status,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      }
    });

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
