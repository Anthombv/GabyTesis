import { NextApiRequest, NextApiResponse } from "next";
import { Permission } from "../../types";
import { PermissionModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userName = req.body.userName as string;
  // fetch the posts
  // @ts-ignore
  const permissions = await PermissionModel.find({ soliciter: userName });

  return res.status(200).json({
    message: "Todos los permisos de " + userName,
    data: permissions as Array<Permission>,
    success: true,
  });
}
