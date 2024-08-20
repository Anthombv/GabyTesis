import { NextApiRequest, NextApiResponse } from "next";
import { Product } from "../../types";
import { ProductModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const product = await ProductModel.find({});

  return res.status(200).json({
    message: "Todos los productos",
    data: product as Array<Product>,
    success: true,
  });
}
