import { NextApiRequest, NextApiResponse } from "next";
import { SolicitudeInmogestion } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, SolicitudeInmogestionModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const solicitudeInmogestion = req.body as SolicitudeInmogestion;
  const userName = req.headers.username as string;
  const role = req.headers.role as string;

  const newSolicitude = (): SolicitudeInmogestion => {
    switch (role) {
      case "9":
        return { ...solicitudeInmogestion, applicantDate: FormatedDate() };
      case "2":
        return { ...solicitudeInmogestion, accountantDate: FormatedDate() };
      case "3":
        return { ...solicitudeInmogestion, treasuryDate: FormatedDate() };
      case "4":
        return { ...solicitudeInmogestion, financialDate: FormatedDate() };
      case "6":
        return {
          ...solicitudeInmogestion,
          contableAdvanceDate: FormatedDate(),
        };
      default:
        return solicitudeInmogestion;
    }
  };

  const resp = await SolicitudeInmogestionModel.findOneAndUpdate(
    {
      _id: solicitudeInmogestion.id,
    },
    newSolicitude()
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Edito la Solicitud de IG" + solicitudeInmogestion.number,
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
