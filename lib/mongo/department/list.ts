import { NextApiRequest, NextApiResponse } from "next";
import { UserDeparment } from "../../types";
import { DeparmentModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // fetch the posts
  const departments = await DeparmentModel.find({})

  return res.status(200).json({
    message: "Todos los Departamentos",
    data: departments as Array<UserDeparment>,
    success: true,
  });
}