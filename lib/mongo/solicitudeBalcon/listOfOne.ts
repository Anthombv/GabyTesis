import { NextApiRequest, NextApiResponse } from "next";
import { SolicitudeBalcon } from "../../types";
import { SolicitudeBalconModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userName = req.body.userName as string;
  // fetch the posts
  // @ts-ignore
  const solicitudes = await SolicitudeBalconModel.find({
    soliciter: userName,
    imageTreasuryState: { $ne: "Aprobado" },
  });

  return res.status(200).json({
    message: "Todas las solicitudes de " + userName,
    data: solicitudes as Array<SolicitudeBalcon>,
    success: true,
  });
}
