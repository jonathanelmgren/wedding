import sgMail from "@sendgrid/mail";
import { NextApiRequest, NextApiResponse } from "next";

const API_KEY = process.env.SENDGRID_API || "";

sgMail.setApiKey(API_KEY);

const msg = {
  to: "jonathan@elmgren.dev",
  from: "jonathan@elmgren.dev",
  subject: "WEDDING SUMBISSION",
  text: "",
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  msg.text = JSON.stringify(req.query.form);

  try {
    switch (req.method) {
      case "GET":
        await sgMail.send(msg);
        return res.send("Sent");
      default:
        return res.status(403).send("Aja baja!");
    }
  } catch (e) {
    return res.status(500).send("Något gick fel!");
  }
};

export default handler;
