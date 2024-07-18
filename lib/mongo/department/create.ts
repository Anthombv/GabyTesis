import { NextApiRequest, NextApiResponse } from "next";
import { UserDeparment } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, DeparmentModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const department = req.body as UserDeparment;
  const userName = req.headers.username as string;
  // fetch the posts
  const newDepartment = new DeparmentModel(department);

  await newDepartment.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creo un Departamento: "+department.name,
  });
  await auditory.save();

  return res.status(200).json({
    message: "Departamento Creado",
    success: true,
  });
}
