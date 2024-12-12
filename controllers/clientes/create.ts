import { NextApiRequest, NextApiResponse } from "next";
import { Customer } from "../../model";
import FormatedDate from "../../lib/utils/formated_date";
import { CustomerModel, AuditoryModel } from "../../model/schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cliente = req.body as Customer;
  const userName = req.headers.username as string;

  const newcliente = new CustomerModel(cliente);

  await newcliente.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creo un Cliente: " + cliente.name,
  });
  await auditory.save();

  return res.status(200).json({
    message: "Cliente Creado",
    success: true,
  });
}
