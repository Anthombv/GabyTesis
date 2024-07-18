import { NextApiRequest, NextApiResponse } from "next";
import { FactureProviderIg } from "../../types";
import { ProviderIgModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  // fetch the posts
  const providerIg = await ProviderIgModel.findById(id)

  return res.status(200).json({
    message: "un proveedor",
    data: providerIg as FactureProviderIg,
    success: true,
  });
}