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
    subject: `Notificación de Solicitud de Permiso`,
    html: `
          <div>
          <h4>Estimado Dpto. RRHH</h4>
          <p>El colaborador: <strong>${req.body.soliciter}</strong> creo una solicitud de permisos</p>
          <p><strong>Fecha del permiso: </strong>${req.body.dateS}</p>
          <p>Desde las: <strong>${req.body.startTime}</strong>, Hasta las: <strong>${req.body.finalTime}</strong></p>
          <p>El permiso que escogio fue: <strong>${req.body.typePermissions}</strong></p>
          <p>Duracion del permiso: <strong>${req.body.requestedHour}</strong> horas o minutos</p>
          <p>Detalle: ${req.body.details}</p>
          <p>Nota:</p>
          <p>Por favor revisar la solicitud en el Sistema</p>
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
