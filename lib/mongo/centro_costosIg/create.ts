import { NextApiRequest, NextApiResponse } from "next";
import { FactureCenterIg } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { CenterIgModel, AuditoryModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const centerIg = req.body as FactureCenterIg;
  const userName = req.headers.username as string;
  // fetch the posts
  const newCenterIg = new CenterIgModel(centerIg);

  await newCenterIg.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creo un Centro de costos: "+centerIg.name,
  });
  await auditory.save();

  return res.status(200).json({
    message: "Centro de Costos Creado",
    success: true,
  });
}
