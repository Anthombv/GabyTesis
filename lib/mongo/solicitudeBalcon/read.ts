import { NextApiRequest, NextApiResponse } from "next";
import { SolicitudeBalcon } from "../../types";
import { SolicitudeBalconModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const id = req.query.id as string;

    // fetch the posts
    const solicitudeBalcon = await SolicitudeBalconModel.findById(id)

    return res.status(200).json({
      message: "una solicitud",
      data: solicitudeBalcon as SolicitudeBalcon,
      success: true,
    });
  }