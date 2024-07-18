import { NextApiRequest, NextApiResponse } from "next";
import { SolicitudeBalcon } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, SolicitudeBalconModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const solicitudeBalcon = req.body as SolicitudeBalcon;
  const userName = req.headers.username as string;
  const role = req.headers.role as string;

  const newSolicitude = (): SolicitudeBalcon => {
    switch (role) {
      case "9":
        return { ...solicitudeBalcon, applicantDate: FormatedDate() };
      case "2":
        return { ...solicitudeBalcon, accountantDate: FormatedDate() };
      case "3":
        return { ...solicitudeBalcon, treasuryDate: FormatedDate() };
      case "4":
        return { ...solicitudeBalcon, financialDate: FormatedDate() };
      case "6":
        return { ...solicitudeBalcon, contableAdvanceDate: FormatedDate() };
      default:
        return solicitudeBalcon;
    }
  };

  const resp = await SolicitudeBalconModel.findOneAndUpdate(
    {
      _id: solicitudeBalcon.id,
    },
    newSolicitude()
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Edito la Solicitud de Balcon" + solicitudeBalcon.number,
  });
  await auditory.save();

  if (resp === null)
    return res.status(500).json({
      message: "Solicitud no encontrada",
      success: false,
    });

  return res.status(200).json({
    message: "Solicitud editada",
    success: true,
  });
}
