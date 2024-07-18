import { NextApiRequest, NextApiResponse } from "next";
import { Advance } from "../../types";
import { AdvanceModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const id = req.query.id as string;

    // fetch the posts
    const advance = await AdvanceModel.findById(id)

    return res.status(200).json({
      message: "un anticipo",
      data: advance as Advance,
      success: true,
    });
  }