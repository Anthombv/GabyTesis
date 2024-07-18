import { NextApiRequest, NextApiResponse } from "next";
import { FactureCenterIg } from "../../types";
import { CenterIgModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // fetch the posts
  const centersIg = await CenterIgModel.find({}).sort({"name": 1})

  return res.status(200).json({
    message: "Todos los Bancos",
    data: centersIg as Array<FactureCenterIg>,
    success: true,
  });
}