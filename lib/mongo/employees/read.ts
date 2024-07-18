import { NextApiRequest, NextApiResponse } from "next";
import { Employees } from "../../types";
import { EmployeesModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  const employe = await EmployeesModel.findById(id);

  return res.status(200).json({
    message: "Un empleado",
    data: employe as Employees,
    success: true,
  });
}
