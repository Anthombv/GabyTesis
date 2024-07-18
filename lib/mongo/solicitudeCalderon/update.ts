import { NextApiRequest, NextApiResponse } from "next";
import { SolicitudeCalderon } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, SolicitudeCalderonModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const solicitudeCalderon = req.body as SolicitudeCalderon;
  const userName = req.headers.username as string;
  const role = req.headers.role as string;

  const newSolicitude = (): SolicitudeCalderon => {
    switch (role) {
      case "9":
        return { ...solicitudeCalderon, applicantDate: FormatedDate() };
      case "2":
        return { ...solicitudeCalderon, accountantDate: FormatedDate() };
      case "3":
        return { ...solicitudeCalderon, treasuryDate: FormatedDate() };
      case "4":
        return { ...solicitudeCalderon, financialDate: FormatedDate() };
      case "6":
        return { ...solicitudeCalderon, contableAdvanceDate: FormatedDate() };
      default:
        return solicitudeCalderon;
    }
  };

  const resp = await SolicitudeCalderonModel.findOneAndUpdate(
    {
      _id: solicitudeCalderon.id,
    },
    newSolicitude()
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Edito la Solicitud de Calderon" + solicitudeCalderon.number,
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
