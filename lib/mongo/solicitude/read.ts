import { NextApiRequest, NextApiResponse } from "next";
import { Solicitude } from "../../types";
import { SolicitudeModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const id = req.query.id as string;

    // fetch the posts
    const solicitude = await SolicitudeModel.findById(id)

    return res.status(200).json({
      message: "una solicitud",
      data: solicitude as Solicitude,
      success: true,
    });
  }