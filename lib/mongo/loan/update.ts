import { NextApiRequest, NextApiResponse } from "next";
import { Loan } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, LoanModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const loan = req.body as Loan;
  const userName = req.headers.username as string;
  const role = req.headers.role as string;

  const newLoan = (): Loan => {
    switch (role) {
      case "2":
        return { ...loan, dateState: FormatedDate() };
      default:
        return loan;
    }
  };
  // @ts-ignore
  const resp = await LoanModel.findOneAndUpdate(
    {
      _id: loan.id,
    },
    newLoan()
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Edito el prestamo" + loan.number,
  });
  await auditory.save();

  if (resp === null)
    return res.status(500).json({
      message: "Prestamos no encontrado",
      success: false,
    });

  return res.status(200).json({
    message: "Prestamo editado",
    success: true,
  });
}
