import { NextApiRequest, NextApiResponse } from "next";
import { Employees } from "../../types";
import { EmployeesModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const employees = await EmployeesModel.find({});

  return res.status(200).json({
    message: "Todos los empleados",
    data: employees as Array<Employees>,
    success: true,
  });
}
