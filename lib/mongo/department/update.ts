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
  const resp = await DeparmentModel.findOneAndUpdate(
    {
      _id: department.id,
    },
    department
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Actualizo un Departamento: "+resp.name+" a: "+department.name,
  });
  await auditory.save();

  if (resp === null)
    return res.status(500).json({
      message: "Departamento no encontrado",
      success: false,
    });

  return res.status(200).json({
    message: "Departamento editado",
    success: true,
  });
}
