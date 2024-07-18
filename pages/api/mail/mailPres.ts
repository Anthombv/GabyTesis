import { NextApiRequest, NextApiResponse } from "next";

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: NextApiRequest, res: NextApiResponse) {
  let nodemailer = require("nodemailer");

  const transporter = nodemailer.createTransport({
    port: process.env.SMTP_PORT,
    host: process.env.SMTP_HOST,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
    secure: true,
  });
  const mailData = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: `Notificación de Solicitud de Prestamos`,
    html: `
          <div>
          <h4>Estimado: Santiago Jurado</h4>
          <p>El usuario: <strong>${req.body.soliciter}</strong> creo una solicitud de Prestamo</p>
          <p>Detalle</p>
          <p><strong>Valor de prestamo: </strong>${req.body.requestedDays}</p>
          <p>Tipo de prestamo: ${req.body.typePermissions}</p>
          <p>Plazo para paga prestamos: ${req.body.dateS}</p>
          <p>Mes que se empezara a descontar su prestamos: ${req.body.dateE}</p>
          <p>Por favor revisar la solicitud en la pagina de Solicitud de Prestamos</p>
          </div>
          `,
  };
  transporter.sendMail(mailData, function (err: any, info: any) {
    if (err) {
      err;
    } else {
      info;
    }
  });
  res.status(200).json({ status: "OK" });
}
