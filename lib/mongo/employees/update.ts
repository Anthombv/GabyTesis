import { NextApiRequest, NextApiResponse } from "next";
import { Employees } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, EmployeesModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const employe = req.body as Employees;
  const userName = req.headers.username as string;
  const resp = await EmployeesModel.findOneAndUpdate(
    {
      _id: employe.id,
    },
    employe
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Actualizo Empleado" + employe.beneficiary,
  });
  await auditory.save();

  if (resp === null)
    return res.status(500).json({
      message: "Empleado no encontrado",
      success: false,
    });

  return res.status(200).json({
    message: "Empleado editado",
    success: true,
  });
}
