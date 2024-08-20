import { NextApiRequest, NextApiResponse } from "next";
import { Product } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { ProductModel, AuditoryModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const product = req.body as Product;
  const userName = req.headers.username as string;

  const newproduct = new ProductModel(product);

  await newproduct.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creo un Producto: " + product.name,
  });
  await auditory.save();

  return res.status(200).json({
    message: "Producto Creado",
    success: true,
  });
}
