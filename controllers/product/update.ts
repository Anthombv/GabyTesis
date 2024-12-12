import { NextApiRequest, NextApiResponse } from "next";
import { Product } from "../../model";
import FormatedDate from "../../lib/utils/formated_date";
import { AuditoryModel, ProductModel } from "../../model/schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const product = req.body as Product;
  const userName = req.headers.username as string;
  const resp = await ProductModel.findOneAndUpdate(
    {
      _id: product.id,
    },
    product
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Actualizó producto" + product.name, 
  });
  await auditory.save();
  
  if (resp === null)
    return res.status(500).json({
      message: "Producto no encontrado",
      success: false,
    });

  return res.status(200).json({
    message: "Producto editado",
    success: true,
  });
}
