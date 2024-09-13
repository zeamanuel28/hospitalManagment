import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import Prescription from '@/backend/model/Prescription';

export const POST = async request => {
  const {transactionId,prescriptionId} = await request.json ();
  try {
    await connect ();

    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
      return new NextResponse (JSON.stringify ({message: 'Not Found'}), {
        status: 403,
      });
    }

    (prescription.status = "Completed"),(prescription.paymentTid = transactionId), (prescription.updatedAt = Date.now ()), await prescription.save (); // Update the updatedAt field with the current timestamp
    return new NextResponse (
      JSON.stringify ({message: 'Despensed Succesfully'}),
      {status: 200}
    );
  } catch (err) {
    return new NextResponse (JSON.stringify ({error: 'Database Error'}), {
      status: 500,
    });
  }
};
