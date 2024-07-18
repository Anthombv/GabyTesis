import { NextApiRequest, NextApiResponse } from "next";
import { AdvanceRecaudaciones } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AdvanceRecaudacionesModel, AuditoryModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const advanceRecaudaciones = req.body as AdvanceRecaudaciones;
  const userName = req.headers.username as string;
  const role = req.headers.role as string;

  const newAdvance = (): AdvanceRecaudaciones => {
    switch (role) {
      case "1":
        return { ...advanceRecaudaciones, applicantDate: FormatedDate() };
      case "2":
        return { ...advanceRecaudaciones, accountantDate: FormatedDate() };
      case "3":
        return { ...advanceRecaudaciones, treasuryDate: FormatedDate() };
      case "4":
        return { ...advanceRecaudaciones, financialDate: FormatedDate() };
      case "5":
        return { ...advanceRecaudaciones, advanceDate: FormatedDate() };
      case "6":
        return { ...advanceRecaudaciones, contableAdvanceDate: FormatedDate() };  
      case "7": 
        return { ...advanceRecaudaciones, imageTreasuryDate: FormatedDate() };  
      default:
        return advanceRecaudaciones;
    }
  };

  const resp = await AdvanceRecaudacionesModel.findOneAndUpdate(
    {
      _id: advanceRecaudaciones.id,
    },
    newAdvance()
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Edito una Anticipo",
  });
  await auditory.save();

  if (resp === null)
    return res.status(500).json({
      message: "Anticipo no encontrada",
      success: false,
    });

  return res.status(200).json({
    message: "Anticipo editada",
    success: true,
  });
}
