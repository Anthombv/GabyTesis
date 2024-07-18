import { NextApiRequest, NextApiResponse } from "next";
import { Loan } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, BackupLoanModel, LoanModel } from "../schemas";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const loan = req.body as Loan;
  const userName = req.headers.username as string;
  const count: number = await BackupLoanModel.countDocuments();

  const lo = new LoanModel({ ...loan, number: count + 1 });

  await lo.save();

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Creó Prestamo N° " + loan.number,
  });
  await auditory.save();

  const backup = new BackupLoanModel({ loan: lo._id });

  await backup.save();

  return res.status(200).json({
    message: "Prestamo creado",
    success: true,
  });
}
