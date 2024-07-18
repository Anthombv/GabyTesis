import { NextApiRequest, NextApiResponse } from "next";
import { Permission } from "../../types";
import { Pendiente } from "../../utils/constants";
import { PermissionModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // fetch the posts
  // @ts-ignore
  const permissions = await PermissionModel.find({ state: Pendiente });

  if (req.query.dates !== undefined) {
    const dates: Array<string> = (req.query.dates as string).split("¡");
    const date1 = new Date(dates[0]);
    const date2 = new Date(dates[1]);
    date2.setDate(date2.getDate() + 1);

    const filtered = [];

    permissions.forEach((permi: Permission) => {
      const permiDates = permi.date.replace(",", "").split(" ")[0].split("/");
      const permiDate = new Date(
        permiDates[2] +
          "-" +
          (permiDates[1].length < 2 ? "0" + permiDates[1] : permiDates[1]) +
          "-" +
          (permiDates[1].length < 2 ? "0" + permiDates[0] : permiDates[0])
      );
      if (
        date1.getTime() <= permiDate.getTime() &&
        permiDate.getTime() < date2.getTime()
      ) {
        filtered.push(permi);
      }
    });
    return res.status(200).json({
      message: "Todas los permisos",
      data: filtered as Array<Permission>,
      success: true,
    });
  } else {
    return res.status(200).json({
      message: "Todos los permisos",
      data: permissions as Array<Permission>,
      success: true,
    });
  }
}
