import { NextApiRequest, NextApiResponse } from "next";
import { AdvanceCalderon } from "../../types";
import { Cerrado } from "../../utils/constants";
import { AdvanceCalderonModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userName = req.body.userName as string;

  //@ts-ignore
  const advances = await AdvanceCalderonModel.find({
    soliciter: userName,
    contableAdvanceState: { $ne: Cerrado },
  });

  return res.status(200).json({
    message: "Todos los anticipos de " + userName,
    data: advances as Array<AdvanceCalderon>,
    success: true,
  });
}
