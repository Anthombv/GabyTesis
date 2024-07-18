import { NextApiRequest, NextApiResponse } from "next";
import { FactureProviderBalcon } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, ProviderBalconModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const providerBalcon = req.body as FactureProviderBalcon;
  const userName = req.headers.username as string;
  // fetch the posts
  const newProviderBalcon = new ProviderBalconModel(providerBalcon);

  await newProviderBalcon.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creo un proveedor: "+providerBalcon.name,
  });
  await auditory.save();

  return res.status(200).json({
    message: "Proveedor Creado",
    success: true,
  });
}
