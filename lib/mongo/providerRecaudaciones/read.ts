import { NextApiRequest, NextApiResponse } from "next";
import { FactureProviderRecaudaciones } from "../../types";
import { ProviderRecaudacionesModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  // fetch the posts
  const providerRecaudaciones = await ProviderRecaudacionesModel.findById(id)

  return res.status(200).json({
    message: "un proveedor",
    data: providerRecaudaciones as FactureProviderRecaudaciones,
    success: true,
  });
}