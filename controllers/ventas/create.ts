import { NextApiRequest, NextApiResponse } from "next";
import { Sale } from "../../model";
import FormatedDate from "../../lib/utils/formated_date";
import { AuditoryModel, SaleModel } from "../../model/schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const venta = req.body as Sale;
  const userName = req.headers.username as string;

  const newVenta = new SaleModel(venta);

  await newVenta.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creo una Venta: " + venta.id,
  });
  await auditory.save();

  return res.status(200).json({
    message: "Venta Creada",
    success: true,
  });
}
