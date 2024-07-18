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
  const resp = await ProviderModel.findOneAndUpdate(
    {
      _id: provider.id,
    },
    provider
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Actualizo un Proveedor: "+resp.name+" a: "+provider.name,
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
