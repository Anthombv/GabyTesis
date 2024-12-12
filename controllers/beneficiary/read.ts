import { NextApiRequest, NextApiResponse } from "next";
import { Beneficiary } from "../../model";
import { BeneficiaryModel } from "../../model/schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  // fetch the posts
  const beneficiary = await BeneficiaryModel.findById(id)

  return res.status(200).json({
    message: "un beneficiario",
    data: beneficiary as Beneficiary,
    success: true,
  });
}