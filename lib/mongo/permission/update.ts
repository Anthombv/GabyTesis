import { NextApiRequest, NextApiResponse } from "next";
import { Permission } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, PermissionModel, } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const permission = req.body as Permission;
  const userName = req.headers.username as string;
  const role = req.headers.role as string;

  const newPermission = (): Permission => {
    switch (role) {
      case '2':
        return { ...permission, dateState: FormatedDate() }
      default:
        return permission  
    }
  }
  
  // @ts-ignore
  const resp = await PermissionModel.findOneAndUpdate({
    _id: permission.id
  }, newPermission());

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Edito un Permiso",
  });
  await auditory.save();

  if (resp === null)
    return res.status(500).json({
      message: "Permiso no encontrado",
      success: false,
    });

  return res.status(200).json({
    message: "Permiso editado",
    success: true,
  });

}