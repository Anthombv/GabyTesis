import { NextApiRequest, NextApiResponse } from "next";
import { Permission } from "../../types";
import { PermissionModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  // fetch the posts
  // @ts-ignore
  const permission = await PermissionModel.findById(id);

  return res.status(200).json({
    message: "un permiso",
    data: permission as Permission,
    success: true,
  });
}
