import { NextApiRequest, NextApiResponse } from "next";
import { SolicitudeRecaudaciones } from "../../types";
import { SolicitudeRecaudacionesModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const id = req.query.id as string;

    // fetch the posts
    const solicitudeRecaudaciones = await SolicitudeRecaudacionesModel.findById(id)

    return res.status(200).json({
      message: "una solicitud",
      data: solicitudeRecaudaciones as SolicitudeRecaudaciones,
      success: true,
    });
  }