import { NextApiRequest, NextApiResponse } from "next";
import { HolidaysModel } from "../schemas";
import { Holidays } from "../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  // fetch the posts
  // @ts-ignore
  const solicitude = await HolidaysModel.findById(id);

  return res.status(200).json({
    message: "una solicitud",
    data: solicitude as Holidays,
    success: true,
  });
}
