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
      html: `<div style="background-color: #141D26; font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:50px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
          <a href="" style="font-size:1.4em;color: #fff;text-decoration:none;font-weight:600">Buzzats</a>
        </div>
        <p style="font-size:1.1em; color: #fff;">Hi,</p>
        <p style="color: #fff;">Use this OTP code to verify yourself. Lot's of fun awaits you...😋</p>
        <h2 style="background: #4137BD;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${code}</h2>
        <p style="color: #fff; font-size:0.9em;">Regards,<br />Buzzats</p>
        <hr style="border:none;border-top:1px solid #eee" />
        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
          <p>Buzzats</p>
          <p>Somewhere in Lahore</p>
        </div>
      </div>
    </div>
                    `,
    };

    await sgMail.send(msg).then((response: [ClientResponse, {}]) => {
      if (response[0].statusCode >= 200) return resolve("Success");
      else return reject("Error");
    });
  });
};
