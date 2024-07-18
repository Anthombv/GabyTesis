import { NextApiRequest, NextApiResponse } from "next";
import { FactureCenter } from "../../types";
import { CenterModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  // fetch the posts
  const center = await CenterModel.findById(id)

  return res.status(200).json({
    message: "un centro de costos",
    data: center as FactureCenter,
    success: true,
  });
}