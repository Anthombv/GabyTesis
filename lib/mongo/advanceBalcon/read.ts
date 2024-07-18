import { NextApiRequest, NextApiResponse } from "next";
import { AdvanceBalcon } from "../../types";
import { AdvanceBalconModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const id = req.query.id as string;

    // fetch the posts
    const advanceBalcon = await AdvanceBalconModel.findById(id)

    return res.status(200).json({
      message: "un anticipo",
      data: advanceBalcon as AdvanceBalcon,
      success: true,
    });
  }