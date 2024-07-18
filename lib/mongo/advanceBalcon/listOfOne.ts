import { NextApiRequest, NextApiResponse } from "next";
import { AdvanceBalcon } from "../../types";
import { Cerrado } from "../../utils/constants";
import { AdvanceBalconModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userName = req.body.userName as string;

  // @ts-ignore
  const advances = await AdvanceBalconModel.find({
    soliciter: userName,
    contableAdvanceState: { $ne: Cerrado },
  });

  return res.status(200).json({
    message: "Todos los anticipos de " + userName,
    data: advances as Array<AdvanceBalcon>,
    success: true,
  });
}
