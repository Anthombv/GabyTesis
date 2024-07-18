import { NextApiRequest, NextApiResponse } from "next";
import { FactureProvider } from "../../types";
import { ProviderModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // fetch the posts
  const providers = await ProviderModel.find({}).sort({"name": 1})

  return res.status(200).json({
    message: "Todos los Proveedores",
    data: providers as Array<FactureProvider>,
    success: true,
  });
}