import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, ClientModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = req.body as Client;
  const userName = req.headers.username as string;
  const resp = await ClientModel.findOneAndUpdate(
    {
      _id: client.id,
    },
    client
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Actualizó Beneficiario" + client.beneficiary, 
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
