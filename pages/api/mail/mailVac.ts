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
    subject: `Notificación de Solicitud de Vacaciones`,
    html:`
        <div>
          <h4>Estimado Dpto. RRHH</h4>
          <p>El colaborador: ${req.body.soliciter} creo una solicitud de vacaciones</p>
          <p>Detalle</p>
          <p>Desde el: ${req.body.dateS}</p>
          <p>Hasta el: ${req.body.dateE}</p>
          <p>El tipo de permiso que escogio fue: ${req.body.typePermissions}</p>
          <p>Dias totales: ${req.body.requestedDays}</p>
          <p>Por favor revisar la solicitud en la pagina de Solicitud de Vacaciones</p>
        </div>
        `,
  };
  try {
    const info = await transporter.sendMail(mailData);
    res.status(200).json({ status: "OK", info });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al enviar el correo electrónico" });
  }
}
