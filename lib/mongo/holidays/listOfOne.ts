import { NextApiRequest, NextApiResponse } from "next";
import { Holidays } from "../../types";
import { HolidaysModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userName = req.body.userName as string;
  // fetch the posts
  // @ts-ignore
  const solicitudes = await HolidaysModel.find({ soliciter: userName });

  return res.status(200).json({
    message: "Todas las Vacaciones de " + userName,
    data: solicitudes as Array<Holidays>,
    success: true,
  });
}
