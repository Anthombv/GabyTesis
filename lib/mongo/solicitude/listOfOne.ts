import { NextApiRequest, NextApiResponse } from "next";
import { Solicitude } from "../../types";
import { SolicitudeModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userName = req.body.userName as string;
  // fetch the posts
  // @ts-ignore
  const solicitudes = await SolicitudeModel.find({
    soliciter: userName,
    imageTreasuryState: { $ne: "Aprobado" },
  });

  return res.status(200).json({
    message: "Todas las solicitudes de " + userName,
    data: solicitudes as Array<Solicitude>,
    success: true,
  });
}
