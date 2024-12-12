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

  const newBank = new BanksModel(bank);

  await newBank.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creo un banco: " + bank.bank,
  });
  await auditory.save();

  return res.status(200).json({
    message: "Banco Creado",
    success: true,
  });
}
