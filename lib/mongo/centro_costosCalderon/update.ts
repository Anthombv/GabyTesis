import { NextApiRequest, NextApiResponse } from "next";
import { FactureCenterCalderon } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, CenterCalderonModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const centerCalderon = req.body as FactureCenterCalderon;
  const userName = req.headers.username as string;
  const resp = await CenterCalderonModel.findOneAndUpdate(
    {
      _id: centerCalderon.id,
    },
    centerCalderon
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Actualizo un Centro de Costos: "+resp.name+" a: "+centerCalderon.name,
  });
  await auditory.save();
  
  if (resp === null)
    return res.status(500).json({
      message: "Centro de Costos no encontrado",
      success: false,
    });

  return res.status(200).json({
    message: "Centro de Costos editado",
    success: true,
  });
}
