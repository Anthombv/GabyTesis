import { NextApiRequest, NextApiResponse } from "next";
import { FactureCenterCalderon } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { CenterCalderonModel, AuditoryModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const centerCalderon = req.body as FactureCenterCalderon;
  const userName = req.headers.username as string;
  // fetch the posts
  const newCenterCalderon = new CenterCalderonModel(centerCalderon);

  await newCenterCalderon.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creo un Centro de costos: "+centerCalderon.name,
  });
  await auditory.save();

  return res.status(200).json({
    message: "Centro de Costos Creado",
    success: true,
  });
}
