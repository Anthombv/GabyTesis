import { NextApiRequest, NextApiResponse } from "next";
import { FactureProviderCalderon } from "../../types";
import { ProviderCalderonModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // fetch the posts
  const providersCalderon = await ProviderCalderonModel.find({}).sort({"name": 1})

  return res.status(200).json({
    message: "Todos los Proveedores",
    data: providersCalderon as Array<FactureProviderCalderon>,
    success: true,
  });
}