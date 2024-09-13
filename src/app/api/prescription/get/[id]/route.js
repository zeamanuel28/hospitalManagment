import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import Prescription from '@/backend/model/Prescription';

export const GET = async (request, { params }) => {
  const {id}=params
  try {
    await connect ();

    const result = await Prescription.find({patientId:id}).populate('physicianId','IdNo').sort({_id:-1});

    const results= result.map(doc => {
      return {
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
