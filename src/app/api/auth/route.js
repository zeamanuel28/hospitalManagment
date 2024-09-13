import { NextResponse } from "next/server";
import jwt  from "jsonwebtoken";
import env from "@/backend/config/env";

const SECRETKEY=env.SECRETKEY
const expiresIn=env.expiresIn

export const POST = async (request) => {
  const { token} = await request.json()

  try {
    if (token == null) {
        return new NextResponse(JSON.stringify({message:"UnAuth"}),{status:401})
      }
    
      jwt.verify(token, SECRETKEY, (err, user) => {
        if (err) {
            return new NextResponse(JSON.stringify({message:"Forbidden"}),{status:403})
        }
      });

    return new NextResponse(JSON.stringify({message:'auth'}), { status: 200 });
  } catch (err) {
    console.log(err)
    return new NextResponse(JSON.stringify({ message: "Database Error" }), { status: 500 });
  }
};