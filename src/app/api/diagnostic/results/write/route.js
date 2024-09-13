import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import User from '@/backend/model/User';
import DiagnosticResult from '@/backend/model/DiagnosticResult';
import Patient from '@/backend/model/Patient';
import Diagnostic from '@/backend/model/Diagnostic';

export const POST = async request => {
  const {
    patientId,
    diagnosticId,requestId,
    test,
    notes,
    conclusions,
    image,
    findings,
  } = await request.json ();

  try {
    await connect ();
    let userId = await User.findOne ({IdNo: diagnosticId});
    if (!userId)
      return new NextResponse (JSON.stringify ({message: 'User Not Found'}), {
        status: 404,
      });

    let patientIds = await Patient.findOne ({IdNo: patientId});
    if (!patientIds)
      return new NextResponse (JSON.stringify ({message: 'Patient Not Found'}), {
        status: 404,
      });

    const diagnostic = await Diagnostic.findById(requestId);
    diagnostic.status='Completed'
    diagnostic.updatedAt = Date.now()
    await diagnostic.save()

    const newDiagnosticResult = new DiagnosticResult ({
      patientId:patientIds._id,
      diagnosticId: userId._id,
      diagnosticTest:diagnostic._id,
      test,
      notes,
      conclusions,
      image,
      findings,
    });
    await newDiagnosticResult.save ();

    return new NextResponse (
      JSON.stringify ({message: 'Diagnostic Result Saved Succesfully'}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
