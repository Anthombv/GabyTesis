import { NextApiRequest, NextApiResponse } from "next";
import { SolicitudeBalcon } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, BackupBalconModel, SolicitudeBalconModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const solicitudeBalcon = req.body as SolicitudeBalcon;
  const userName = req.headers.username as string;
  const count: number = await BackupBalconModel.countDocuments()

  const soliBalcon = new SolicitudeBalconModel({ ...solicitudeBalcon, number: count + 1})

  await soliBalcon.save()

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creo Solicitud de Balcon N°"+solicitudeBalcon.number,
  })
  await auditory.save()

  const backupBalcon = new BackupBalconModel({ solicitudeBalcon: soliBalcon._id})

  await backupBalcon.save()

  return res.status(200).json({
    message: "Solicitud creada",
    success: true,
  })
}
