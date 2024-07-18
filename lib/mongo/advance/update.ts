import { NextApiRequest, NextApiResponse } from "next";
import { Advance } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, AdvanceModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const advance = req.body as Advance;
  const userName = req.headers.username as string;
  const role = req.headers.role as string;

  const newAdvance = (): Advance => {
    switch (role) {
      case "9":
        return { ...advance, applicantDate: FormatedDate() };
      case "2":
        return { ...advance, accountantDate: FormatedDate() };
      case "3":
        return { ...advance, treasuryDate: FormatedDate() };
      case "4":
        return { ...advance, financialDate: FormatedDate() };
      case "6":
        return { ...advance, contableAdvanceDate: FormatedDate() };
      default:
        return advance;
    }
  };

  const resp = await AdvanceModel.findOneAndUpdate(
    {
      _id: advance.id,
    },
    newAdvance()
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Edito el Anticipo de IC" + advance.number,
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
