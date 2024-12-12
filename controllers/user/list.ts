import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../model";
import { UserModel } from "../../model/schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // fetch the posts
  const solicitudes = await UserModel.find({}, { password: 0 })

  return res.status(200).json({
    message: "todas los usuarios",
    data: solicitudes as Array<User>,
    success: true,
  });
}