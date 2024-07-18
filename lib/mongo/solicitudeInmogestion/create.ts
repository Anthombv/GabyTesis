import { NextApiRequest, NextApiResponse } from "next";
import { SolicitudeInmogestion } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, BackupInmogestionModel, SolicitudeInmogestionModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const solicitudeInmogestion = req.body as SolicitudeInmogestion;
  const userName = req.headers.username as string;
  const count: number = await BackupInmogestionModel.countDocuments();

  // fetch the posts
  const soliInmogestion = new SolicitudeInmogestionModel({ ...solicitudeInmogestion, number: count + 1 });

  await soliInmogestion.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creó Solicitud N°"+solicitudeInmogestion.number,
  });
  await auditory.save();

  const backupInmogestion = new BackupInmogestionModel({ solicitudeInmogestion: soliInmogestion._id });

  await backupInmogestion.save();

  return res.status(200).json({
    message: "Solicitud creada",
    success: true,
  });
}
