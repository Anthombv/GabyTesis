import { NextApiRequest, NextApiResponse } from "next";
import { FactureCenter } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { CenterModel, AuditoryModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const center = req.body as FactureCenter;
  const userName = req.headers.username as string;
  // fetch the posts
  const newCenter = new CenterModel(center);

  await newCenter.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creo un Centro de costos: "+center.name,
  });
  await auditory.save();

  return res.status(200).json({
    message: "Centro de Costos Creado",
    success: true,
  });
}
