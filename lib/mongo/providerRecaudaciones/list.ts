import { NextApiRequest, NextApiResponse } from "next";
import { FactureProviderRecaudaciones } from "../../types";
import { ProviderRecaudacionesModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // fetch the posts
  const providersRecaudaciones = await ProviderRecaudacionesModel.find({}).sort({"name": 1})

  return res.status(200).json({
    message: "Todos los Proveedores",
    data: providersRecaudaciones as Array<FactureProviderRecaudaciones>,
    success: true,
  });
}