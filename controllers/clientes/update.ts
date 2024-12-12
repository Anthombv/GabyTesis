import { NextApiRequest, NextApiResponse } from "next";
import { Customer } from "../../model";
import FormatedDate from "../../lib/utils/formated_date";
import { AuditoryModel, CustomerModel,  } from "../../model/schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = req.body as Customer;
  const userName = req.headers.username as string;
  const resp = await CustomerModel.findOneAndUpdate(
    {
      _id: client.id,
    },
    client
  );

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Actualizó Cliente" + client.name, 
  });
  await auditory.save();
  
  if (resp === null)
    return res.status(500).json({
      message: "Cliente no encontrado",
      success: false,
    });

  return res.status(200).json({
    message: "Cliente editado",
    success: true,
  });
}
