import sgMail, { ClientResponse, MailDataRequired } from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = function (email: string, code: string) {
  return new Promise(async (resolve, reject) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

    const msg: MailDataRequired = {
      to: email,
      from: "buzzatsapp@gmail.com",
      subject: "OTP Verification for Buzzats",
      html: `<p>Please use the following code to complete the sign up process</p>
                    <p><strong>OTP Code: </strong>${code}</p>
                    <p>If you did not request this code, kindly ignore this email.</p>
                    <p>Buzzats Management</p>
                    `,
    };

    await sgMail.send(msg).then((response: [ClientResponse, {}]) => {
      if (response[0].statusCode >= 200) return resolve("Success");
      else return reject("Error");
    });
  });
};
