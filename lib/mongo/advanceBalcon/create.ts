import { NextApiRequest, NextApiResponse } from "next";
import { AdvanceBalcon } from "../../types";
import FormatedDate from "../../utils/formated_date";
import {
  AdvanceBalconModel,
  AuditoryModel, BackupAdvanceBalconModel
} from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const advanceBalcon = req.body as AdvanceBalcon;
  const userName = req.headers.username as string;
  const count: number = await BackupAdvanceBalconModel.countDocuments();

  const advaBalcon = new AdvanceBalconModel({
    ...advanceBalcon,
    number: count + 1,
  });

  await advaBalcon.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creo Anticipo Inmogestion # " + advanceBalcon.number,
  });
  await auditory.save();

  const backupBalcon = new BackupAdvanceBalconModel({
    advanceBalcon: advaBalcon._id,
  });

  await backupBalcon.save();

  return res.status(200).json({
    message: "Anticipo creado",
    success: true,
  });
}
