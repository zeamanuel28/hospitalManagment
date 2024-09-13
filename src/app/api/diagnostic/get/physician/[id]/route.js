import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import Diagnostic from '@/backend/model/Diagnostic';
import Patient from '@/backend/model/Patient';
import User from '@/backend/model/User';

export const GET = async (request,{params}) => {
  const {id}=params

  try {
    await connect ();
    const user=await User.findOne({IdNo:id})
    if(!user){
      return new NextResponse (
        JSON.stringify ({message:'Physican Not Found'}),
        {status: 404}
      );
    }

    const diagnostic = await Diagnostic.find({physicianId:user._id}).populate('patientId', 'fullName IdNo').sort({_id:-1});

    const diagnostics= diagnostic.map(doc => {
      return {
        fullName: doc.patientId.fullName,
        IdNo: doc.patientId.IdNo,
        priority: doc.priority,
        instructions: doc.instructions,
        reason: doc.reason,
        test: doc.test,
        status: doc.status,
        bodyType: doc.bodyType,
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
