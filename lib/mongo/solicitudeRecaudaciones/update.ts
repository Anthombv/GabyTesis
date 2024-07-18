import { NextApiRequest, NextApiResponse } from "next";
import { SolicitudeRecaudaciones } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, SolicitudeRecaudacionesModel, } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const solicitudeRecaudaciones = req.body as SolicitudeRecaudaciones;
  const userName = req.headers.username as string;
  const role = req.headers.role as string;

  const newSolicitude= (): SolicitudeRecaudaciones => {
    switch (role) {
      case '1':
        return { ...solicitudeRecaudaciones, applicantDate: FormatedDate() }
      case '2':
        return { ...solicitudeRecaudaciones, accountantDate: FormatedDate() }
      case '3':
        return { ...solicitudeRecaudaciones, treasuryDate: FormatedDate() }
      case '4':
        return { ...solicitudeRecaudaciones, financialDate: FormatedDate() }
      case '5': 
        return { ...solicitudeRecaudaciones, imageTreasuryDate: FormatedDate() } 
      case '6': 
        return { ...solicitudeRecaudaciones, contableAdvanceDate: FormatedDate() }
      case '7':
        return { ...solicitudeRecaudaciones, advanceDate: FormatedDate() }    
      default:
        return solicitudeRecaudaciones  
    }
  }

  const resp = await SolicitudeRecaudacionesModel.findOneAndUpdate({
    _id: solicitudeRecaudaciones.id
  }, newSolicitude());

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Edito una Solicitud",
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