import { NextApiRequest, NextApiResponse } from "next";
import { Customer } from "../../types";
import { CustomerModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const clientes = await CustomerModel.find({});

  return res.status(200).json({
    message: "Todos los clientes",
    data: clientes as Array<Customer>,
    success: true,
  });
}
