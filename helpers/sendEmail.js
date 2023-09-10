require("dotenv").config();
const nodemailer = require("nodemailer");

const { MAILTRAP_USER, MAILTRAP_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false,
  auth: {
    user: MAILTRAP_USER,
    pass: MAILTRAP_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const message = { ...data, from: "a.g.genov@gmail.com" };
  await transport
    .sendMail(message)
    .then(() => console.log("Email send success"))
    .catch((error) => console.error(error));

  // return true;
};

module.exports = sendEmail;
