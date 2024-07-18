import { NextApiRequest, NextApiResponse } from "next";
import { AdvanceInmogestion } from "../../types";
import { Cerrado } from "../../utils/constants";
import { AdvanceInmogestionModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userName = req.body.userName as string;

  // @ts-ignore
  const advances = await AdvanceInmogestionModel.find({
    soliciter: userName,
    contableAdvanceState: { $ne: Cerrado },
  });

  return res.status(200).json({
    message: "Todos los anticipos de " + userName,
    data: advances as Array<AdvanceInmogestion>,
    success: true,
  });
}
