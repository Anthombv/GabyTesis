import { NextApiRequest, NextApiResponse } from "next";
import { SolicitudeCalderon } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, BackupCalderonModel, SolicitudeCalderonModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const solicitudeCalderon = req.body as SolicitudeCalderon;
  const userName = req.headers.username as string;
  const count: number = await BackupCalderonModel.countDocuments();

  // fetch the posts
  const soliCalderon = new SolicitudeCalderonModel({ ...solicitudeCalderon, number: count + 1 });

  await soliCalderon.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creó Solicitud N°"+solicitudeCalderon.number,
  });
  await auditory.save();

  const backupCalderon = new BackupCalderonModel({ solicitudeCalderon: soliCalderon._id });

  await backupCalderon.save();

  return res.status(200).json({
    message: "Solicitud creada",
    success: true,
  });
}
