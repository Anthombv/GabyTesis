import { NextApiRequest, NextApiResponse } from "next";
import { Nomina } from "../../types";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, NominaModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const nomina = req.body as Nomina;
  const userName = req.headers.username as string;
  const role = req.headers.role as string;

  const newNomina = (): Nomina => {
    switch (role) {
      case "5":
        return { ...nomina, soliciterState: FormatedDate() };
      default:
        return nomina;
    }
  };

  const resp = await NominaModel.findOneAndUpdate(
    {
      _id: nomina.id,
    },
    newNomina()
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Edito la nomina " + nomina.number,
  });
  await auditory.save();

  if (resp === null)
    return res.status(500).json({
      message: "Nomina no encontrada",
      success: false,
    });

  return res.status(200).json({
    message: "Nomina editada",
    success: true,
  });
}
