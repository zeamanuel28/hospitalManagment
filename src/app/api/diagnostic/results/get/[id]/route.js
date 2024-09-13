import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import DiagnosticResult from '@/backend/model/DiagnosticResult';

export const GET = async (request, { params }) => {
  const {id}=params
  try {
    await connect ();

    const result = await DiagnosticResult.find({patientId:id}).populate('diagnosticId','IdNo').sort({_id:-1});

    const results= result.map(doc => {
      return {
        diagnosticId: doc.diagnosticId.IdNo,
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
