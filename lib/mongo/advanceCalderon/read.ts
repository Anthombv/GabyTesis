import { NextApiRequest, NextApiResponse } from "next";
import { AdvanceCalderon } from "../../types";
import { AdvanceCalderonModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const id = req.query.id as string;

    // fetch the posts
    const advanceCalderon = await AdvanceCalderonModel.findById(id)

    return res.status(200).json({
      message: "un anticipo",
      data: advanceCalderon as AdvanceCalderon,
      success: true,
    });
  }