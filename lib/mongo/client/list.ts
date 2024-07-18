import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "../../types";
import { ClientModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const clients = await ClientModel.find({});

  return res.status(200).json({
    message: "Todos los numeros de cuenta",
    data: clients as Array<Client>,
    success: true,
  });
}
