import { NextApiRequest, NextApiResponse } from "next";
import { AdvanceInmogestion } from "../../types";
import FormatedDate from "../../utils/formated_date";
import {
  AdvanceInmogestionModel,
  AuditoryModel,
  BackupAdvanceInmogestionModel,
} from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const advanceInmogestion = req.body as AdvanceInmogestion;
  const userName = req.headers.username as string;
  const count: number = await BackupAdvanceInmogestionModel.countDocuments();

  const advaInmogestion = new AdvanceInmogestionModel({
    ...advanceInmogestion,
    number: count + 1,
  });

  await advaInmogestion.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creo Anticipo Inmogestion # " + advanceInmogestion.number,
  });
  await auditory.save();

  const backupInmogestion = new BackupAdvanceInmogestionModel({
    advanceInmogestion: advaInmogestion._id,
  });

  await backupInmogestion.save();

  return res.status(200).json({
    message: "Anticipo creado",
    success: true,
  });
}
