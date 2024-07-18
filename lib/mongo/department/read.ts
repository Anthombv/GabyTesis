import { NextApiRequest, NextApiResponse } from "next";
import { UserDeparment } from "../../types";
import { DeparmentModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  // fetch the posts
  const department = await DeparmentModel.findById(id)

  return res.status(200).json({
    message: "un departamento",
    data: department as UserDeparment,
    success: true,
  });
}