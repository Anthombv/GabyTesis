import { NextApiRequest, NextApiResponse } from "next";
import { FactureCenter } from "../../types";
import { CenterModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // fetch the posts
  const centers = await CenterModel.find({}).sort({"name": 1})

  return res.status(200).json({
    message: "Todos los Bancos",
    data: centers as Array<FactureCenter>,
    success: true,
  });
}