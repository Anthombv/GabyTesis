import { NextApiRequest, NextApiResponse } from "next";
import { SolicitudeRecaudaciones } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, BackupRecaudacionesModel, SolicitudeRecaudacionesModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const solicitudeRecaudaciones = req.body as SolicitudeRecaudaciones;
  const userName = req.headers.username as string;
  const count: number = await BackupRecaudacionesModel.countDocuments()

  const soliRecaudaciones = new SolicitudeRecaudacionesModel({ ...solicitudeRecaudaciones, number: count + 1})

  await soliRecaudaciones.save()

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creo Solicitud de Balcon N°"+solicitudeRecaudaciones.number,
  })
  await auditory.save()

  const backupRecaudaciones = new BackupRecaudacionesModel({ solicitudeBalcon: soliRecaudaciones._id})

  await backupRecaudaciones.save()

  return res.status(200).json({
    message: "Solicitud creada",
    success: true,
  })
}
