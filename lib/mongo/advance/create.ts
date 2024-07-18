import { NextApiRequest, NextApiResponse } from "next";
import { Advance } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, BackupAdvanceModel, AdvanceModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const advance = req.body as Advance;
  const userName = req.headers.username as string;
  const count: number = await BackupAdvanceModel.countDocuments();

  // fetch the posts
  const adva = new AdvanceModel({ ...advance, number: count + 1 });

  await adva.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creó Anticipo N°"+advance.number,
  });
  await auditory.save();

  const backup = new BackupAdvanceModel({ advance: adva._id });

  await backup.save();

  return res.status(200).json({
    message: "Anticipo creado",
    success: true,
  });
}
