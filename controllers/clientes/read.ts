import { NextApiRequest, NextApiResponse } from "next";
import { Customer } from "../../model";
import { CustomerModel } from "../../model/schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  // fetch the posts
  const client = await CustomerModel.findById(id)

  return res.status(200).json({
    message: "un cliente",
    data: client as Customer,
    success: true,
  });
}