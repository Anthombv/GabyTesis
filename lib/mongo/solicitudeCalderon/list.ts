import { NextApiRequest, NextApiResponse } from "next";
import { SolicitudeCalderon } from "../../types";
import { Aprobado } from "../../utils/constants";
import { SolicitudeCalderonModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // fetch the posts
  const solicitudesCalderon = await SolicitudeCalderonModel.find({
    imageTreasuryState: { $ne: Aprobado },
  });

  if (req.query.dates !== undefined) {
    const dates: Array<string> = (req.query.dates as string).split('¡')
    const date1 = new Date(dates[0])
    const date2 = new Date(dates[1])
    date2.setDate(date2.getDate() + 1)

    // console.log('si', [date1, date2])

    const filtered = []

    solicitudesCalderon.forEach((soli: SolicitudeCalderon) => {
      const soliDates = soli.date.replace(',', '').split(' ')[0].split('/')
      const soliDate = new Date(soliDates[2] + '-' + (soliDates[1].length < 2 ? '0' + soliDates[1] : soliDates[1]) + '-' + (soliDates[1].length < 2 ? '0' + soliDates[0] : soliDates[0]))
      if (date1.getTime() <= soliDate.getTime() && soliDate.getTime() < date2.getTime()) {
        filtered.push(soli)
      }
    })

    return res.status(200).json({
      message: "todas las solicitudes",
      data: filtered as Array<SolicitudeCalderon>,
      success: true,
    });

  } else {
  return res.status(200).json({
    message: "todas las solicitudes",
    data: solicitudesCalderon as Array<SolicitudeCalderon>,
    success: true,
  });
}
  }

