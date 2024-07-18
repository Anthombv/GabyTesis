import { NextApiRequest, NextApiResponse } from "next";
import { Bank } from "../../types";
import { BanksModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  //fetch the posts
  const bank = await BanksModel.findById(id);

  return res.status(200).json({
    message: "Un banco",
    data: bank as Bank,
    success: true,
  });
}