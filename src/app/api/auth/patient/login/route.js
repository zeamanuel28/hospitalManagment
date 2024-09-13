import { NextResponse } from "next/server";
import connect from "@/backend/config/db";
import jwt  from "jsonwebtoken";
import env from "@/backend/config/env";
import bcrypt from 'bcrypt';
import Patient from "@/backend/model/Patient";
import PatientLog from "@/backend/model/PatientLog";

const SECRETKEY=env.SECRETKEY
const expiresIn=env.expiresIn

export const POST = async (request) => {
  const { email,password } = await request.json()

  try {
    await connect();

    const user = await Patient.findOne({email:email});
    if(!user){
      return new NextResponse(JSON.stringify({message:"Email Not Found"}),{status:403})
    }

    if(user.status!=='Active'){
      return new NextResponse(JSON.stringify({message:"Account Suspended Contact Admin"}),{status:403})
    }

    const match = await bcrypt.compare (password, user.password);

    if( !match){
      const newLog = new PatientLog ({
        type: "Incorrect Password",
        user: user._id,
      });
      await newLog.save ();
      return new NextResponse(JSON.stringify({message:"Invalid Password"}),{status:403})
    }

    const IdNo=user.IdNo

    const token=jwt.sign({ userId: user._id },SECRETKEY,{expiresIn:expiresIn})
    user.token=token
    await user.save();
    const newLog = new PatientLog ({
      type: "Login",
      user: user._id,
    });
    await newLog.save ();

    return new NextResponse(JSON.stringify({token,IdNo}), { status: 200 });
  } catch (err) {
    console.log(err)
    return new NextResponse(JSON.stringify({ message: "Database Error" }), { status: 500 });
  }
};