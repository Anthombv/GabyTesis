import { NextApiRequest, NextApiResponse } from "next";
import read from "../../../lib/mongo/solicitude/read";
import remove from "../../../lib/mongo/solicitude/delete";
import dbConnect from "../../../lib/middlewares/mongo";
import listOfOne from "../../../lib/mongo/solicitude/listOfOne";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // connect to the database
    await dbConnect();

    switch (req.method) {
      case "GET":
        return await read(req, res);
      case "POST":
        return await listOfOne(req, res);
      case "DELETE":
        return await remove(req, res);
      default:
        throw new Error("Invalid method");
    }
  } catch (error) {
    console.error(error);
    // return the error
    return res.status(500).json({
      message: new Error(error).message,
      success: false,
    });
  }
}

export const config = {
  api: {
    responseLimit: false,
  },
};
