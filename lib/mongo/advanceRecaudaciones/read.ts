import { NextApiRequest, NextApiResponse } from "next";
import { AdvanceRecaudaciones } from "../../types";
import { AdvanceRecaudacionesModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const id = req.query.id as string;

    // fetch the posts
    const advanceRecaudaciones = await AdvanceRecaudacionesModel.findById(id)

    return res.status(200).json({
      message: "un anticipo",
      data: advanceRecaudaciones as AdvanceRecaudaciones,
      success: true,
    });
  }