import { NextApiRequest, NextApiResponse } from "next";
import { FactureCenterIg } from "../../types";
import { CenterIgModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  // fetch the posts
  const centerIg = await CenterIgModel.findById(id)

  return res.status(200).json({
    message: "un centro de costos",
    data: centerIg as FactureCenterIg,
    success: true,
  });
}