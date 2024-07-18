import { NextApiRequest, NextApiResponse } from "next";
import { Nomina } from "../../types";
import { NominaModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  const nomina = await NominaModel.findById(id);

  return res.status(200).json({
    message: "Una nomina",
    data: nomina as Nomina,
    success: true,
  });
}
