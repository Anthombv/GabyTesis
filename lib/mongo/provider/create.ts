import { NextApiRequest, NextApiResponse } from "next";
import { FactureProvider } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, ProviderModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const provider = req.body as FactureProvider;
  const userName = req.headers.username as string;
  // fetch the posts
  const newProvider = new ProviderModel(provider);

  await newProvider.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creo un proveedor: "+provider.name,
  });
  await auditory.save();

  return res.status(200).json({
    message: "Proveedor Creado",
    success: true,
  });
}
