import { NextApiRequest, NextApiResponse } from "next";
import { FactureCenterIg } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, CenterIgModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const centerIg = req.body as FactureCenterIg;
  const userName = req.headers.username as string;
  const resp = await CenterIgModel.findOneAndUpdate(
    {
      _id: centerIg.id,
    },
    centerIg
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Actualizo un Centro de Costos: "+resp.name+" a: "+centerIg.name,
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
