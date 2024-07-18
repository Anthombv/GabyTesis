import { NextApiRequest, NextApiResponse } from "next";
import { FactureCenterCalderon } from "../../types";
import { CenterCalderonModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // fetch the posts
  const centersCalderon = await CenterCalderonModel.find({}).sort({"name": 1})

  return res.status(200).json({
    message: "Todos los Bancos",
    data: centersCalderon as Array<FactureCenterCalderon>,
    success: true,
  });
}