import { NextApiRequest, NextApiResponse } from "next";
import { FactureCenterBalcon } from "../../types";
import { CenterBalconModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // fetch the posts
  const centersBalcon = await CenterBalconModel.find({}).sort({"name": 1})

  return res.status(200).json({
    message: "Todos los Bancos",
    data: centersBalcon as Array<FactureCenterBalcon>,
    success: true,
  });
}