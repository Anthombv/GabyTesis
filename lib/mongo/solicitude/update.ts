import { NextApiRequest, NextApiResponse } from "next";
import { Solicitude } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, SolicitudeModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const solicitude = req.body as Solicitude;
  const userName = req.headers.username as string;
  const role = req.headers.role as string;

  const newSolicitude = (): Solicitude => {
    switch (role) {
      case "9":
        return { ...solicitude, applicantDate: FormatedDate() };
      case "2":
        return { ...solicitude, accountantDate: FormatedDate() };
      case "3":
        return { ...solicitude, treasuryDate: FormatedDate() };
      case "4":
        return { ...solicitude, financialDate: FormatedDate() };
      case "6":
        return { ...solicitude, contableAdvanceDate: FormatedDate() };
      default:
        return solicitude;
    }
  };

  const resp = await SolicitudeModel.findOneAndUpdate(
    {
      _id: solicitude.id,
    },
    newSolicitude()
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Edito la Solicitud de IC" + solicitude.number,
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
