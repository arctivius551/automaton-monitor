import { run } from "@util/database";
import type { NextApiRequest, NextApiResponse } from 'next'
 
type ResponseData = {
  message: string
}
 
export async function GET( req: NextApiRequest, res: NextApiResponse<ResponseData> ) {
    try{
      await run();
      return res.status(200).json({ message: 'Hello from Next.js!' });
    }catch( e ){
      return res.status(500).json({message: `${e}`});
    }
}