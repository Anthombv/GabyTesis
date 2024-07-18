import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { ClientModel, AuditoryModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = req.body as Client;
  const userName = req.headers.username as string;

  const newClient = new ClientModel(client);

  await newClient.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creo un Beneficiario: " + client.beneficiary,
  });
  await auditory.save();

  return res.status(200).json({
    message: "Beneficiario Creado",
    success: true,
  });
}
