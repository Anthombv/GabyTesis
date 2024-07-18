import { NextApiRequest, NextApiResponse } from "next";
import { FactureProviderCalderon } from "../../types";
import { ProviderCalderonModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  // fetch the posts
  const providerCalderon = await ProviderCalderonModel.findById(id)

  return res.status(200).json({
    message: "un proveedor",
    data: providerCalderon as FactureProviderCalderon,
    success: true,
  });
}