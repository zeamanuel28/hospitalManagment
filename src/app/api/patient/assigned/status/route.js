import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import AssignDoc from '@/backend/model/AssignDoc';

export const POST = async request => {
    const {id} = await request.json ();
  try {
    await connect ();
    const assignDoc = await AssignDoc.findOne({_id:id});
    assignDoc.status='Completed'
    assignDoc.updatedAt=Date.now()
    await assignDoc.save()

    return new NextResponse (
      JSON.stringify ({message:'Status Saved'}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
