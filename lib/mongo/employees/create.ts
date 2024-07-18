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

  const newEmploye = new EmployeesModel(employe);

  await newEmploye.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creo un empleado: " + employe.beneficiary,
  });
  await auditory.save();

  return res.status(200).json({
    message: "Empleado Creado",
    success: true,
  });
}
