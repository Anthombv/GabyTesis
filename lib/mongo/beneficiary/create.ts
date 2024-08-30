import { NextApiRequest, NextApiResponse } from "next";
import { Beneficiary } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { BeneficiaryModel, AuditoryModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const beneficiary = req.body as Beneficiary;
  const userName = req.headers.username as string;

  const newbeneficiary = new BeneficiaryModel(beneficiary);

  await newbeneficiary.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creo un Beneficiario: " + beneficiary.beneficiary,
  });
  await auditory.save();

  return res.status(200).json({
    message: "Beneficiario Creado",
    success: true,
  });
}
