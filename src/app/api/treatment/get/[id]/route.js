import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import Treatment from '@/backend/model/Treatment';

export const GET = async (request, { params }) => {
  const {id}=params
  try {
    await connect ();

    const result = await Treatment.find({patientId:id}).populate('physicianId','IdNo').sort({_id:-1});

    const results= result.map(doc => {
      return {
        physicianId: doc.physicianId.IdNo,
        visitType: doc.visitType,
        complaint: doc.complaint,
        presentIllness: doc.presentIllness,
        pastMedicalHistory: doc.pastMedicalHistory,
        familyHistory: doc.familyHistory,
        socialHistory: doc.socialHistory,
        reviewOfSystems: doc.reviewOfSystems,
        emotional: doc.emotional,
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
