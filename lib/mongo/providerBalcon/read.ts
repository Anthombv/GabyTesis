import { NextApiRequest, NextApiResponse } from "next";
import { FactureProviderBalcon } from "../../types";
import { ProviderBalconModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  // fetch the posts
  const providerBalcon = await ProviderBalconModel.findById(id)

  return res.status(200).json({
    message: "un proveedor",
    data: providerBalcon as FactureProviderBalcon,
    success: true,
  });
}