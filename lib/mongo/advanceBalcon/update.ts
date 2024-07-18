import { NextApiRequest, NextApiResponse } from "next";
import { AdvanceBalcon } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AdvanceBalconModel, AuditoryModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const advanceBalcon = req.body as AdvanceBalcon;
  const userName = req.headers.username as string;
  const role = req.headers.role as string;

  const newAdvance = (): AdvanceBalcon => {
    switch (role) {
      case "9":
        return { ...advanceBalcon, applicantDate: FormatedDate() };
      case "2":
        return { ...advanceBalcon, accountantDate: FormatedDate() };
      case "3":
        return { ...advanceBalcon, treasuryDate: FormatedDate() };
      case "4":
        return { ...advanceBalcon, financialDate: FormatedDate() };
      case "6":
        return { ...advanceBalcon, contableAdvanceDate: FormatedDate() };
      default:
        return advanceBalcon;
    }
  };

  const resp = await AdvanceBalconModel.findOneAndUpdate(
    {
      _id: advanceBalcon.id,
    },
    newAdvance()
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Edito el Anticipo de Balcon" + advanceBalcon.number,
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
