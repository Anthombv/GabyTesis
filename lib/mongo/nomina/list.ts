import { NextApiRequest, NextApiResponse } from "next";
import { Nomina } from "../../types";
import { Aprobado } from "../../utils/constants";
import { NominaModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const nominas = await NominaModel.find({ state: { $ne: Aprobado } });

  if (req.query.dates !== undefined) {
    const dates: Array<string> = (req.query.dates as string).split("¡");
    const date1 = new Date(dates[0]);
    const date2 = new Date(dates[1]);
    date2.setDate(date2.getDate() + 1);

    const filtered = [];

    nominas.forEach((soli: Nomina) => {
      const soliDates = soli.date.replace(",", "").split(" ")[0].split("/");
      const soliDate = new Date(
        soliDates[2] +
          "-" +
          (soliDates[1].length < 2 ? "0" + soliDates[1] : soliDates[1]) +
          "-" +
          (soliDates[1].length < 2 ? "0" + soliDates[0] : soliDates[0])
      );
      if (
        date1.getTime() <= soliDate.getTime() &&
        soliDate.getTime() < date2.getTime()
      ) {
        filtered.push(soli);
      }
    });

    return res.status(200).json({
      message: "Todas las Nominas",
      data: filtered as Array<Nomina>,
      success: true,
    });
  } else {
    return res.status(200).json({
      message: "Todas las Nominas",
      data: nominas as Array<Nomina>,
      success: true,
    });
  }
}
