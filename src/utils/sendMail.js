// Importamos nuestras dependencias
import nodemailer from "nodemailer";
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } from "../../env.js";

// Nodemailer es una dependencia externa que nos permite enviar correos electrónicos personalizados

// Preparando el transporte de nuestro correo
const transport = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// Creamos la finción para realizar el envío del correo al usuario al registrarse
const sendMailUtil = async (email, subject, body) => {
  try {
    const mailOptions = {
      from: SMTP_USER,
      to: email,
      subject: subject,
      text: body,
    };
    await transport.sendMail(mailOptions);
  } catch (error) {
    console.error("error al enviar el email" + error);
  }
};

export default sendMailUtil;
