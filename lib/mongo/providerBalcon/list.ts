import { NextApiRequest, NextApiResponse } from "next";
import { FactureProviderBalcon } from "../../types";
import { ProviderBalconModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // fetch the posts
  const providersBalcon = await ProviderBalconModel.find({}).sort({"name": 1})

  return res.status(200).json({
    message: "Todos los Proveedores",
    data: providersBalcon as Array<FactureProviderBalcon>,
    success: true,
  });
}