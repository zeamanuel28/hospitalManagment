import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import Prescription from '@/backend/model/Prescription';
import User from '@/backend/model/User';

export const GET = async (request, { params }) => {
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

    const result = await Prescription.find({physicianId:user._id}).populate('physicianId','IdNo').populate('patientId','_id IdNo fullName sex dateOfBirth').sort({_id:-1});

    const results= result.map(doc => {
      return {
        _id: doc._id,
        PId: doc.patientId._id,
        fullName: doc.patientId.fullName,
        IdNo: doc.patientId.IdNo,
        dateOfBirth: doc.patientId.dateOfBirth,
        sex: doc.patientId.sex,
        medications: doc.medications,
        physicianId: doc.physicianId.IdNo,
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
