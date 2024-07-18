import { NextApiRequest, NextApiResponse } from "next";
import { Solicitude } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, BackupModel, SolicitudeModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const solicitude = req.body as Solicitude;
  const userName = req.headers.username as string;
  const count: number = await BackupModel.countDocuments();

  // fetch the posts
  const soli = new SolicitudeModel({ ...solicitude, number: count + 1 });

  await soli.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creó Solicitud N°" + solicitude.number,
  });
  await auditory.save();

  const backup = new BackupModel({ solicitude: soli._id });

  await backup.save();

  return res.status(200).json({
    message: "Solicitud creada",
    success: true,
  });
}
