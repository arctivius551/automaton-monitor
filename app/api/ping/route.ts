import { NextResponse, type NextRequest } from 'next/server'
import { run } from "@util/database";

type ResponseData = {
  message: string
}

export async function GET(request: NextRequest) {
  try{
    //await run();
    return NextResponse.json({message: 'Hello from Next.js'} as ResponseData);
  }catch( e ){
    return NextResponse.json( 
      { message: `${e}`},
      { status: 500 }
    )
  }
}