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
  const resp = await ProviderCalderonModel.findOneAndUpdate(
    {
      _id: providerCalderon.id,
    },
    providerCalderon
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Actualizo un Proveedor: "+resp.name+" a: "+providerCalderon.name,
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
