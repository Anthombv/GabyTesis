import { NextApiRequest, NextApiResponse } from "next";
import { Sale } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, SaleModel,  } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const venta = req.body as Sale;
  const userName = req.headers.username as string;
  const resp = await SaleModel.findOneAndUpdate(
    {
      _id: venta.id,
    },
    venta
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Actualizó Venta" + venta.id, 
  });
  await auditory.save();
  
  if (resp === null)
    return res.status(500).json({
      message: "Venta no encontrada",
      success: false,
    });

  return res.status(200).json({
    message: "Venta editada",
    success: true,
  });
}
