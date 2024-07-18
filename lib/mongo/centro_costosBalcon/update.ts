import { NextApiRequest, NextApiResponse } from "next";
import { FactureCenterBalcon } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, CenterBalconModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const centerBalcon = req.body as FactureCenterBalcon;
  const userName = req.headers.username as string;
  const resp = await CenterBalconModel.findOneAndUpdate(
    {
      _id: centerBalcon.id,
    },
    centerBalcon
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Actualizo un Centro de Costos: "+resp.name+" a: "+centerBalcon.name,
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
