import { NextApiRequest, NextApiResponse } from "next";
import FormatedDate from "../../utils/formated_date";
import { Holidays } from "../../types";
import { AuditoryModel, BackupHolidaysModel, HolidaysModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const solicitude = req.body as Holidays;
  const userName = req.headers.username as string;
  const count: number = await BackupHolidaysModel.countDocuments();

  // fetch the posts
  const soli = new HolidaysModel({ ...solicitude, number: count + 1 });

  await soli.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creó Vacacion N°"+solicitude.number,
  });
  await auditory.save();

  const backup = new BackupHolidaysModel({ solicitude: soli._id } );

  await backup.save();

  return res.status(200).json({
    message: "Vacacion creada",
    success: true,
  });
}
