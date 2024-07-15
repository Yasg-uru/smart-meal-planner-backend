import nodemailer from "nodemailer";

const Transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  service: "yashpawar12122004@gmail.com",
  auth: {
    user: "yashpawar12122004@gmail.com",
    pass: "nwxb yuwl uioz dzkc",
  },
});

const SendMail = (MailOptions) => {
  try {
    return Transporter.sendMail(MailOptions);
  } catch (error) {
    console.log("Error in Sendin Mail ");
  }
};
export default SendMail;
