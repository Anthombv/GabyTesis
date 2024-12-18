import { NextApiRequest, NextApiResponse } from "next";
import { Product } from "../../model";
import { ProductModel } from "../../model/schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  // fetch the posts
  const product = await ProductModel.findById(id)

  return res.status(200).json({
    message: "un producto",
    data: product as Product,
    success: true,
  });
}