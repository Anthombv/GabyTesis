import { NextApiRequest, NextApiResponse } from "next";
import { FactureCenterCalderon } from "../../types";
import { CenterCalderonModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  // fetch the posts
  const centerCalderon = await CenterCalderonModel.findById(id)

  return res.status(200).json({
    message: "un centro de costos",
    data: centerCalderon as FactureCenterCalderon,
    success: true,
  });
}