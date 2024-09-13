import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import Diagnostic from '@/backend/model/Diagnostic';
import Patient from '@/backend/model/Patient';

export const GET = async (request) => {
  try {
    await connect ();

    const diagnostic = await Diagnostic.find().populate('patientId', 'fullName IdNo').populate('physicianId', 'IdNo').sort({_id:-1});

    const diagnostics= diagnostic.map(doc => {
      return {
        _id: doc._id,
        fullName: doc.patientId.fullName,
        id: doc.patientId.IdNo,
        IdNo: doc.physicianId.IdNo,
        priority: doc.priority,
        instructions: doc.instructions,
        reason: doc.reason,
        test: doc.test,
        bodyType: doc.bodyType,
        status: doc.status,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      }
    });

    return new NextResponse (
      JSON.stringify ({diagnostics}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
