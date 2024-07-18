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
  const resp = await ProviderIgModel.findOneAndUpdate(
    {
      _id: providerIg.id,
    },
    providerIg
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Actualizo un Proveedor: "+resp.name+" a: "+providerIg.name,
  });
  await auditory.save();

  if (resp === null)
    return res.status(500).json({
      message: "Proveedor no encontrado",
      success: false,
    });

  return res.status(200).json({
    message: "Proveedor editado",
    success: true,
  });
}
