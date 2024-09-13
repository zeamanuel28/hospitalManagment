import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import DiagnosticResult from '@/backend/model/DiagnosticResult';
import User from '@/backend/model/User';
import Diagnostic from '@/backend/model/Diagnostic';

export const GET = async (request) => {
  try {
    await connect ();

    const result = await DiagnosticResult.find().populate('diagnosticTest','test bodyType instructions reason status priority createdAt updatedAt physicianId').populate('diagnosticId','IdNo').populate('patientId','IdNo fullName').sort({_id:-1});

    const results= result.map(doc => {
      return {
        testId: doc.diagnosticTest._id,
        patientId: doc.patientId.IdNo,
        fullName: doc.patientId.fullName,
        diagnosticId: doc.diagnosticId.IdNo,
        diagnosticTest:[{
            test:doc.diagnosticTest.test,
            bodyType:doc.diagnosticTest.bodyType,
            instructions:doc.diagnosticTest.instructions,
            status:doc.diagnosticTest.status,
            priority:doc.diagnosticTest.priority,
            reason:doc.diagnosticTest.reason,
            physicianId:doc.diagnosticTest.physicianId,
            createdAt:doc.diagnosticTest.createdAt,
            updatedAt:doc.diagnosticTest.updatedAt,
      }],
        test: doc.test,
        findings: doc.findings,
        conclusions: doc.conclusions,
        image: doc.image,
        notes: doc.notes,
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
