import { NextApiRequest, NextApiResponse } from "next";
import { FactureProviderCalderon } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, ProviderCalderonModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const providerCalderon = req.body as FactureProviderCalderon;
  const userName = req.headers.username as string;
  // fetch the posts
  const newProviderCalderon = new ProviderCalderonModel(providerCalderon);

  await newProviderCalderon.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creo un proveedor: "+providerCalderon.name,
  });
  await auditory.save();

  return res.status(200).json({
    message: "Proveedor Creado",
    success: true,
  });
}
