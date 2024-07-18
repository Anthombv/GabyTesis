import { NextApiRequest, NextApiResponse } from "next";
import { FactureProvider } from "../../types";
import { ProviderModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  // fetch the posts
  const provider = await ProviderModel.findById(id)

  return res.status(200).json({
    message: "un proveedor",
    data: provider as FactureProvider,
    success: true,
  });
}