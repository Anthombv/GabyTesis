import { NextApiRequest, NextApiResponse } from "next";
import { Permission } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, BackupPermissionModel,  PermissionModel, } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const permission = req.body as Permission;
  const userName = req.headers.username as string;
  const count: number = await BackupPermissionModel.countDocuments();

  // fetch the posts
  const permi = new PermissionModel({ ...permission, number: count + 1 });

  await permi.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creó Permiso N° "+permission.number,
  });
  await auditory.save();

  const backup = new BackupPermissionModel({ permission: permi._id });

  await backup.save();

  return res.status(200).json({
    message: "Permiso creado",
    success: true,
  });
}
