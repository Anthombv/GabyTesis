import { NextApiRequest, NextApiResponse } from "next";
import { Nomina } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, BackupNominaModel, NominaModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const nomina = req.body as Nomina;
  const userName = req.headers.username as string;
  const count: number = await BackupNominaModel.countDocuments();

  const nomi = new NominaModel({ ...nomina, number: count + 1 });

  await nomi.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creo nomina # " + nomina.number,
  });
  await auditory.save();

  const backup = new BackupNominaModel({ nomina: nomi._id });
  await backup.save();

  return res.status(200).json({
    message: "Nomina creada",
    success: true,
  });
}
