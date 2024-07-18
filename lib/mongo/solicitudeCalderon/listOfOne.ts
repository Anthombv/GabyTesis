import { NextApiRequest, NextApiResponse } from "next";
import { SolicitudeCalderon } from "../../types";
import { SolicitudeCalderonModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userName = req.body.userName as string;
  // fetch the posts
  // @ts-ignore
  const solicitudes = await SolicitudeCalderonModel.find({
    soliciter: userName,
    imageTreasuryState: { $ne: "Aprobado" },
  });

  return res.status(200).json({
    message: "Todas las solicitudes de " + userName,
    data: solicitudes as Array<SolicitudeCalderon>,
    success: true,
  });
}
