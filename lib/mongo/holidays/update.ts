import { NextApiRequest, NextApiResponse } from "next";
import { Holidays, User } from "../../types";
import { Aprobado } from "../../utils/constants";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, HolidaysModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const solicitude = req.body as Holidays;
  const userName = req.headers.username as string;
  const role = req.headers.role as string;

  const update = role == '2' ? { ...solicitude, dateState: FormatedDate() } : solicitude;

  // @ts-ignore
  const resp = await HolidaysModel.findOneAndUpdate({
    _id: solicitude.id
  }, update);

  if (resp === null) {
    return res.status(500).json({
      message: "Solicitud no encontrada",
      success: false,
    });
  }

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Editó la solicitud de vacaciones " +solicitude.number,
  });

  await auditory.save();

  return res.status(200).json({
    message: "Solicitud editada",
    success: true,
  });

}