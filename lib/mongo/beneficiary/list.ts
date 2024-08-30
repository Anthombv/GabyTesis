import { NextApiRequest, NextApiResponse } from "next";
import { Beneficiary } from "../../types";
import { BeneficiaryModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const beneficiary = await BeneficiaryModel.find({});

  return res.status(200).json({
    message: "Todos los numeros de cuenta",
    data: beneficiary as Array<Beneficiary>,
    success: true,
  });
}
