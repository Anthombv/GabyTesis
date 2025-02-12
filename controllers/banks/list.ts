import { NextApiRequest, NextApiResponse } from "next";
import { Bank } from "../../model";
import { BanksModel } from "../../model/schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const banks = await BanksModel.find({});

  return res.status(200).json({
    message: "Todos los bancos",
    data: banks as Array<Bank>,
    success: true,
  });
}
