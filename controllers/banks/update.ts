import { NextApiRequest, NextApiResponse } from "next";
import { Bank } from "../../model";
import FormatedDate from "../../lib/utils/formated_date";
import { AuditoryModel, BanksModel } from "../../model/schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bank = req.body as Bank;
  const userName = req.headers.username as string;
  const resp = await BanksModel.findOneAndUpdate(
    {
      _id: bank.id,
    },
    bank
  );

  const auditory = new AuditoryModel({
    data: FormatedDate(),
    user: userName,
    action: "Actualizo un Banco " + bank.bank,
  });
  await auditory.save();

  if (resp === null)
    return res.status(500).json({
      message: "Banco no encontrado",
      success: false,
    });

  return res.status(200).json({
    message: "Banco editado",
    success: true,
  });
}
