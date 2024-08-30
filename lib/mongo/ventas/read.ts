import { NextApiRequest, NextApiResponse } from "next";
import { Sale } from "../../types";
import { SaleModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  // fetch the posts
  const ventas = await SaleModel.findById(id)

  return res.status(200).json({
    message: "un ventas",
    data: ventas as Sale,
    success: true,
  });
}