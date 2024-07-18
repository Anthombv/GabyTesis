import { NextApiRequest, NextApiResponse } from "next";
import { AdvanceCalderon } from "../../types";
import FormatedDate from "../../utils/formated_date";
import {
  AdvanceCalderonModel,
  AuditoryModel, BackupAdvanceCalderonModel
} from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const advanceCalderon = req.body as AdvanceCalderon;
  const userName = req.headers.username as string;
  const count: number = await BackupAdvanceCalderonModel.countDocuments();

  const advaCalderon = new AdvanceCalderonModel({
    ...advanceCalderon,
    number: count + 1,
  });

  await advaCalderon.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creo Anticipo Inmogestion # " + advanceCalderon.number,
  });
  await auditory.save();

  const backupCalderon = new BackupAdvanceCalderonModel({
    advanceCalderon: advaCalderon._id,
  });

  await backupCalderon.save();

  return res.status(200).json({
    message: "Anticipo creado",
    success: true,
  });
}
