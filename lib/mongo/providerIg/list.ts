import { NextApiRequest, NextApiResponse } from "next";
import { FactureProviderIg } from "../../types";
import { ProviderIgModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // fetch the posts
  const providersIg = await ProviderIgModel.find({}).sort({"name": 1})

  return res.status(200).json({
    message: "Todos los Proveedores",
    data: providersIg as Array<FactureProviderIg>,
    success: true,
  });
}