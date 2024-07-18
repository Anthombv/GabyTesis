import { NextApiRequest, NextApiResponse } from "next";
import { FactureCenter } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, CenterModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const center = req.body as FactureCenter;
  const userName = req.headers.username as string;
  const resp = await CenterModel.findOneAndUpdate(
    {
      _id: center.id,
    },
    center
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Actualizo un Centro de Costos: "+resp.name+" a: "+center.name,
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
