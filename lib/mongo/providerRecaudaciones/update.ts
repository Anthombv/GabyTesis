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
  const resp = await ProviderRecaudacionesModel.findOneAndUpdate(
    {
      _id: providerRecaudaciones.id,
    },
    providerRecaudaciones
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Actualizo un Proveedor: "+resp.name+" a: "+providerRecaudaciones.name,
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
