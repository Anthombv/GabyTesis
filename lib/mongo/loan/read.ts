import { NextApiRequest, NextApiResponse } from "next";
import { Loan } from "../../types";
import { LoanModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  // fetch the posts
  // @ts-ignore
  const loan = await LoanModel.findById(id);

  return res.status(200).json({
    message: "un prestamo",
    data: loan as Loan,
    success: true,
  })
}
