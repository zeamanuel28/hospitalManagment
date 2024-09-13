import {NextResponse} from 'next/server';
import connect from '@/backend/config/db';
import env from '@/backend/config/env';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import Patient from '@/backend/model/Patient';
import AssignDoc from '@/backend/model/AssignDoc';

export const GET = async request => {

  try {
    await connect ();

    const patient = await AssignDoc.find().populate('patientId', 'IdNo fullName sex dateOfBirth').sort({_id:-1});

    const patients= patient.map(doc => {
      return {
        _id: doc._id,
        fullName: doc.patientId.fullName,
        sex: doc.patientId.sex, 
        IdNo: doc.patientId.IdNo,
        dateOfBirth: doc.patientId.dateOfBirth,
        priorty: doc.priorty,
        department: doc.department,
        triage: doc.triage,
        status: doc.status,
        physician: doc.physician,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      }
    });

    return new NextResponse (
      JSON.stringify ({patients}),
      {status: 200}
    );
  } catch (err) {
    console.log (err);
    return new NextResponse (JSON.stringify ({message: 'Database Error'}), {
      status: 500,
    });
  }
};
