import { NextApiRequest, NextApiResponse } from "next";
import { FactureProviderIg } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, ProviderIgModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const providerIg = req.body as FactureProviderIg;
  const userName = req.headers.username as string;
  // fetch the posts
  const newProviderIg = new ProviderIgModel(providerIg);

  await newProviderIg.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creo un proveedor: "+providerIg.name,
  });
  await auditory.save();

  return res.status(200).json({
    message: "Proveedor Creado",
    success: true,
  });
}
