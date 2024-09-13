import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import Diagnostic from '@/backend/model/Diagnostic';

export const GET = async (request, { params }) => {
  const {id}=params
  try {
    await connect ();

    const result = await Diagnostic.find({patientId:id}).populate('physicianId','IdNo').sort({_id:-1});

    const results= result.map(doc => {
      return {
        IdNo: doc.physicianId.IdNo,
        test: doc.test,
        bodyType: doc.bodyType,
        reason: doc.reason,
        priority: doc.priority,
        instructions: doc.instructions,
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
