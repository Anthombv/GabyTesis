import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "../../types";
import { ClientModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  // fetch the posts
  const client = await ClientModel.findById(id)

  return res.status(200).json({
    message: "un usuario",
    data: client as Client,
    success: true,
  });
}