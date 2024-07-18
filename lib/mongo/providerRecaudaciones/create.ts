import { NextApiRequest, NextApiResponse } from "next";
import { FactureProviderRecaudaciones } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, ProviderRecaudacionesModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const providerRecaudaciones = req.body as FactureProviderRecaudaciones;
  const userName = req.headers.username as string;
  // fetch the posts
  const newProviderRecaudaciones = new ProviderRecaudacionesModel(providerRecaudaciones);

  await newProviderRecaudaciones.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creo un proveedor: "+providerRecaudaciones.name,
  });
  await auditory.save();

  return res.status(200).json({
    message: "Proveedor Creado",
    success: true,
  });
}
