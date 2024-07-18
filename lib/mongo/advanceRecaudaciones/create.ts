import { NextApiRequest, NextApiResponse } from "next";
import { AdvanceRecaudaciones } from "../../types";
import FormatedDate from "../../utils/formated_date";
import {
  AdvanceRecaudacionesModel,
  AuditoryModel, BackupAdvanceRecaudacionesModel
} from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const advanceRecaudaciones = req.body as AdvanceRecaudaciones;
  const userName = req.headers.username as string;
  const count: number = await BackupAdvanceRecaudacionesModel.countDocuments();

  const advaRecaudaciones = new AdvanceRecaudacionesModel({
    ...advanceRecaudaciones,
    number: count + 1,
  });

  await advaRecaudaciones.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creo Anticipo Inmogestion # " + advanceRecaudaciones.number,
  });
  await auditory.save();

  const backupRecaudaciones = new BackupAdvanceRecaudacionesModel({
    advanceBalcon: advaRecaudaciones._id,
  });

  await backupRecaudaciones.save();

  return res.status(200).json({
    message: "Anticipo creado",
    success: true,
  });
}
