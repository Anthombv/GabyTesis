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
  const resp = await ProviderBalconModel.findOneAndUpdate(
    {
      _id: providerBalcon.id,
    },
    providerBalcon
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Actualizo un Proveedor: "+resp.name+" a: "+providerBalcon.name,
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
