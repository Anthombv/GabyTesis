import { NextApiRequest, NextApiResponse } from "next";
import { FactureCenterBalcon } from "../../types";
import { CenterBalconModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  // fetch the posts
  const centerBalcon = await CenterBalconModel.findById(id)

  return res.status(200).json({
    message: "un centro de costos",
    data: centerBalcon as FactureCenterBalcon,
    success: true,
  });
}