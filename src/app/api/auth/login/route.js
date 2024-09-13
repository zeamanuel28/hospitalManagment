import { NextResponse } from "next/server";
import connect from "@/backend/config/db";
import User from "@/backend/model/User";
import jwt  from "jsonwebtoken";
import env from "@/backend/config/env";
import bcrypt from 'bcrypt';
import LoginLog from "@/backend/model/LoginLog";

const SECRETKEY=env.SECRETKEY
const expiresIn=env.expiresIn

export const POST = async (request) => {
  const { email,password,role } = await request.json()

  try {
    await connect();

    const user = await User.findOne({email:email,role:role});
    if(!user){
      return new NextResponse(JSON.stringify({message:"Email Not Found"}),{status:403})
    }

    if(user.status!=='Active'){
      return new NextResponse(JSON.stringify({message:"Account Suspended Contact Admin"}),{status:403})
    }

    const match = await bcrypt.compare (password, user.password);

    if( !match){
      const newLog = new LoginLog ({
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

    const newLog = new LoginLog ({
      type: "Login",
      user: user._id,
    });
    await newLog.save ();

    return new NextResponse(JSON.stringify({token,role,IdNo}), { status: 200 });
  } catch (err) {
    console.log(err)
    return new NextResponse(JSON.stringify({ message: "Database Error" }), { status: 500 });
  }
};