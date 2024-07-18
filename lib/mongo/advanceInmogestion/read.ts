import { NextApiRequest, NextApiResponse } from "next";
import { AdvanceInmogestion } from "../../types";
import { AdvanceInmogestionModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const id = req.query.id as string;

    // fetch the posts
    const advanceInmogestion = await AdvanceInmogestionModel.findById(id)

    return res.status(200).json({
      message: "un anticipo",
      data: advanceInmogestion as AdvanceInmogestion,
      success: true,
    });
  }