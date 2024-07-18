import { NextApiRequest, NextApiResponse } from "next";
import { AdvanceInmogestion } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AdvanceInmogestionModel, AuditoryModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const advanceInmogestion = req.body as AdvanceInmogestion;
  const userName = req.headers.username as string;
  const role = req.headers.role as string;

  const newAdvance = (): AdvanceInmogestion => {
    switch (role) {
      case "9":
        return { ...advanceInmogestion, applicantDate: FormatedDate() };
      case "2":
        return { ...advanceInmogestion, accountantDate: FormatedDate() };
      case "3":
        return { ...advanceInmogestion, treasuryDate: FormatedDate() };
      case "4":
        return { ...advanceInmogestion, financialDate: FormatedDate() };
      case "6":
        return { ...advanceInmogestion, contableAdvanceDate: FormatedDate() };
      default:
        return advanceInmogestion;
    }
  };

  const resp = await AdvanceInmogestionModel.findOneAndUpdate(
    {
      _id: advanceInmogestion.id,
    },
    newAdvance()
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Edito el Anticipo de IG" + advanceInmogestion.number,
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
