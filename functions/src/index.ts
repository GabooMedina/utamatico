/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';


// Configura tu transportador de correo (puedes usar Gmail o cualquier otro servicio)
const transporter = nodemailer.createTransport({
    service: 'gmail', // O el servicio de correo que elijas
    auth: {
      user: 'gabo2008vasco@gmail.com', // Reemplaza con tu correo
      pass: '2008pipo', // Aquí también es mejor usar variables de entorno
    },
  });

  // Función para enviar un correo electrónico
export const sendEmail = functions.https.onRequest(async (req, res) => {
    const { to, subject, text } = req.body;  // Recibe el destinatario, asunto y cuerpo del mensaje desde el cuerpo de la solicitud
  
    // Configura las opciones del correo
    const mailOptions = {
      from: 'gabo2008vasco@gmail.com',  // El remitente (tu correo)
      to,  // El destinatario (correo proporcionado en la solicitud)
      subject,  // Asunto del correo
      text,  // Cuerpo del correo
    };
  
    try {
      // Enviar el correo
      await transporter.sendMail(mailOptions);
      res.status(200).send('Correo enviado con éxito');
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      res.status(500).send('Error al enviar el correo');
    }
  });

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
