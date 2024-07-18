import { NextApiRequest, NextApiResponse } from "next";
import { Loan } from "../../types";
import { LoanModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userName = req.body.userName as string;
  // fetch the posts
  // @ts-ignore
  const loans = await LoanModel.find({ soliciter: userName });

  return res.status(200).json({
    message: "Todos los prestamos de " + userName,
    data: loans as Array<Loan>,
    success: true,
  });
}
