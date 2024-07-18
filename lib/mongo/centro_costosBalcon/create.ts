import { NextApiRequest, NextApiResponse } from "next";
import { FactureCenterBalcon } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { CenterBalconModel, AuditoryModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const centerBalcon = req.body as FactureCenterBalcon;
  const userName = req.headers.username as string;
  // fetch the posts
  const newCenterBalcon = new CenterBalconModel(centerBalcon);

  await newCenterBalcon.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creo un Centro de costos: "+centerBalcon.name,
  });
  await auditory.save();

  return res.status(200).json({
    message: "Centro de Costos Creado",
    success: true,
  });
}
