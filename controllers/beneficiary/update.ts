import { NextApiRequest, NextApiResponse } from "next";
import { Beneficiary } from "../../model";
import FormatedDate from "../../lib/utils/formated_date";
import { AuditoryModel, BeneficiaryModel } from "../../model/schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const beneficiary = req.body as Beneficiary;
  const userName = req.headers.username as string;
  const resp = await BeneficiaryModel.findOneAndUpdate(
    {
      _id: beneficiary.id,
    },
    beneficiary
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Actualizó Beneficiario" + beneficiary.beneficiary, 
  });
  await auditory.save();
  
  if (resp === null)
    return res.status(500).json({
      message: "Beneficiario no encontrado",
      success: false,
    });

  return res.status(200).json({
    message: "Beneficiario editado",
    success: true,
  });
}
