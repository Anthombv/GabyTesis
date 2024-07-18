import { NextApiRequest, NextApiResponse } from "next";
import { AdvanceCalderon } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AdvanceCalderonModel, AuditoryModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const advanceCalderon = req.body as AdvanceCalderon;
  const userName = req.headers.username as string;
  const role = req.headers.role as string;

  const newAdvance = (): AdvanceCalderon => {
    switch (role) {
      case "9":
        return { ...advanceCalderon, applicantDate: FormatedDate() };
      case "2":
        return { ...advanceCalderon, accountantDate: FormatedDate() };
      case "3":
        return { ...advanceCalderon, treasuryDate: FormatedDate() };
      case "4":
        return { ...advanceCalderon, financialDate: FormatedDate() };
      case "6":
        return { ...advanceCalderon, contableAdvanceDate: FormatedDate() };
      default:
        return advanceCalderon;
    }
  };

  const resp = await AdvanceCalderonModel.findOneAndUpdate(
    {
      _id: advanceCalderon.id,
    },
    newAdvance()
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Edito el Anticipo de Calderon" + advanceCalderon.number,
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
