import { NextApiRequest, NextApiResponse } from "next";
import { Sale } from "../../model";
import { SaleModel } from "../../model/schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const ventas = await SaleModel.find({});

  return res.status(200).json({
    message: "Todas las ventas",
    data: ventas as Array<Sale>,
    success: true,
  });
}
